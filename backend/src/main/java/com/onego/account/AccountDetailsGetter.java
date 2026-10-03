package com.onego.account;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import java.util.Map;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import com.onego.db.DatabaseConnection;

public class AccountDetailsGetter {

        private final AccountRequestHandler accountRequestHandler;

        private static final String FRONTEND_URL = DatabaseConnection.getEnv("FRONTEND_URL");

        private static final int MAX_REQUEST_SIZE = 10 * 1024;

        private final HttpServer server;

        private static final int MAX_REQUESTS = 10;

        private static final long RATE_LIMIT_WINDOW = 60_000L;

        private static final int MAX_TRACKED_CLIENTS = 10_000;

        private final Map<String, Deque<Long>> requestTracker = new HashMap<>();

        public AccountDetailsGetter(AccountRequestHandler accountRequestHandler) throws IOException {

                this.accountRequestHandler = accountRequestHandler;

                server = HttpServer.create(
                                new InetSocketAddress(8080),
                                0);

                server.createContext(
                                "/api/account",
                                this::handleAccount);

                server.start();

                System.out.println("Account server started on http://localhost:8080");
        }

        private void handleAccount(HttpExchange exchange) throws IOException {

                String method = exchange.getRequestMethod();

                if (method.equalsIgnoreCase("OPTIONS")) {

                        sendResponse(
                                        exchange,
                                        204,
                                        "");

                        return;
                }

                if (!method.equalsIgnoreCase("POST")) {

                        sendResponse(
                                        exchange,
                                        405,
                                        """
                                                        {"status":"error","message":"Only POST allowed"}
                                                        """);

                        return;
                }

                String clientIp = exchange.getRemoteAddress()
                                .getAddress()
                                .getHostAddress();

                if (!isAllowed(clientIp)) {

                        sendResponse(
                                        exchange,
                                        429,
                                        """
                                                        {"status":"error","message":"Too many requests"}
                                                        """);

                        return;
                }
                String contentLength = exchange.getRequestHeaders()
                                .getFirst("Content-Length");

                if (contentLength != null) {

                        try {

                                long requestSize = Long.parseLong(contentLength);

                                if (requestSize > MAX_REQUEST_SIZE) {

                                        sendResponse(
                                                        exchange,
                                                        413,
                                                        """
                                                                        {"status":"error","message":"Request body too large"}
                                                                        """);

                                        return;
                                }

                        } catch (NumberFormatException e) {

                                sendResponse(
                                                exchange,
                                                400,
                                                """
                                                                {"status":"error","message":"Invalid Content-Length"}
                                                                """);

                                return;
                        }
                }

                try {
                        byte[] requestBytes = exchange.getRequestBody()
                                        .readNBytes(MAX_REQUEST_SIZE + 1);

                        if (requestBytes.length > MAX_REQUEST_SIZE) {

                                sendResponse(
                                                exchange,
                                                413,
                                                """
                                                                {"status":"error","message":"Request body too large"}
                                                                """);

                                return;
                        }

                        String accDetails = new String(
                                        requestBytes,
                                        StandardCharsets.UTF_8);
                        try {
                                var jsonElement = JsonParser.parseString(accDetails);

                                if (!jsonElement.isJsonObject()) {

                                        sendResponse(
                                                        exchange,
                                                        400,
                                                        """
                                                                        {"status":"error","message":"JSON object required"}
                                                                        """);

                                        return;
                                }

                        } catch (JsonSyntaxException e) {

                                sendResponse(
                                                exchange,
                                                400,
                                                """
                                                                {"status":"error","message":"Invalid JSON"}
                                                                """);

                                return;
                        }

                        String authorizationHeader = exchange.getRequestHeaders().getFirst("Authorization");

                        String response = accountRequestHandler.handle(accDetails, authorizationHeader);
                        JsonObject responseObject = JsonParser.parseString(response).getAsJsonObject();
                        int statusCode = responseObject.has("httpStatus")
                                        ? responseObject.get("httpStatus").getAsInt()
                                        : 500;
                        responseObject.remove("httpStatus");

                        sendResponse(exchange, statusCode, responseObject.toString());

                } catch (Exception e) {

                        sendResponse(
                                        exchange,
                                        500,
                                        """
                                                        {"status":"error","message":"Internal server error"}
                                                        """);
                }
        }

        public HttpServer getServer() {
                return server;
        }

        private void sendResponse(
                        HttpExchange exchange,
                        int statusCode,
                        String response) throws IOException {

                byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);

                exchange.getResponseHeaders().set(
                                "Content-Type",
                                "application/json; charset=UTF-8");

                exchange.getResponseHeaders().set(
                                "Access-Control-Allow-Origin",
                                FRONTEND_URL);

                exchange.getResponseHeaders().set(
                                "Access-Control-Allow-Methods",
                                "POST, OPTIONS");

                exchange.getResponseHeaders().set(
                                "Access-Control-Allow-Headers",
                                "Content-Type, Authorization");

                exchange.getResponseHeaders().set("Vary", "Origin");
                exchange.getResponseHeaders().set("Access-Control-Max-Age", "600");
                exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
                exchange.getResponseHeaders().set("Cache-Control", "no-store");

                if (statusCode == 204) {

                        exchange.sendResponseHeaders(
                                        204,
                                        -1);

                        exchange.close();

                        return;
                }

                exchange.sendResponseHeaders(
                                statusCode,
                                responseBytes.length);

                try {
                        exchange.getResponseBody().write(responseBytes);
                } finally {
                        exchange.close();
                }
        }

        private synchronized boolean isAllowed(String clientIp) {

                long now = System.currentTimeMillis();

                Deque<Long> requests = requestTracker.get(clientIp);

                if (requests == null) {

                        // Prevent unlimited memory growth from new IPs.
                        if (requestTracker.size() >= MAX_TRACKED_CLIENTS) {
                                cleanupInactiveClients(now);

                                if (requestTracker.size() >= MAX_TRACKED_CLIENTS) {
                                        evictOldestClient();
                                }
                        }

                        requests = new ArrayDeque<>();
                        requestTracker.put(clientIp, requests);
                }

                // Remove requests outside the current window.
                while (!requests.isEmpty()
                                && now - requests.peekFirst() >= RATE_LIMIT_WINDOW) {

                        requests.pollFirst();
                }

                // Client exceeded the rate limit.
                if (requests.size() >= MAX_REQUESTS) {
                        return false;
                }

                requests.addLast(now);

                return true;
        }

        private void cleanupInactiveClients(long now) {

                requestTracker.entrySet().removeIf(entry -> {

                        Deque<Long> requests = entry.getValue();

                        while (!requests.isEmpty()
                                        && now - requests.peekFirst() >= RATE_LIMIT_WINDOW) {

                                requests.pollFirst();
                        }

                        return requests.isEmpty();
                });
        }

        private void evictOldestClient() {

                String oldestClient = null;
                long oldestRequestTime = Long.MAX_VALUE;

                for (Map.Entry<String, Deque<Long>> entry : requestTracker.entrySet()) {

                        Deque<Long> requests = entry.getValue();

                        if (!requests.isEmpty() && requests.peekFirst() < oldestRequestTime) {
                                oldestRequestTime = requests.peekFirst();
                                oldestClient = entry.getKey();
                        }
                }

                if (oldestClient != null) {
                        requestTracker.remove(oldestClient);
                }
        }
}
