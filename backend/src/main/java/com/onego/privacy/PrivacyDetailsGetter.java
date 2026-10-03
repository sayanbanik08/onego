package com.onego.privacy;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.util.Map;
import com.google.gson.JsonObject;
import com.onego.db.DatabaseConnection;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import com.google.gson.JsonParser;

public class PrivacyDetailsGetter {

    private final PrivacyRequestHandler privacyRequestHandler;
    private static final String FRONTEND_URL = DatabaseConnection.getEnv("FRONTEND_URL");
    private static final int MAX_REQUESTS = 10;
    private static final long RATE_LIMIT_WINDOW = 60_000L;
    private static final int MAX_TRACKED_CLIENTS = 10_000;
    private final Map<String, Deque<Long>> requestTracker = new HashMap<>();

    public PrivacyDetailsGetter(PrivacyRequestHandler privacyRequestHandler, HttpServer server) {

        this.privacyRequestHandler = privacyRequestHandler;

        server.createContext(
                "/api/privacy",
                this::handlePrivacy);
    }

    private void handlePrivacy(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();

        if (!path.equals("/api/privacy")) {
            sendResponse(exchange, 404,
                    """
                            {"status":"error","message":"Endpoint not found"}
                            """);
            return;
        }

        String method = exchange.getRequestMethod();

        // Handle CORS preflight request
        if (method.equalsIgnoreCase("OPTIONS")) {
            sendResponse(exchange, 204, "");
            return;
        }

        // Sirf POST and GET allowed
        if (!method.equalsIgnoreCase("GET") && !method.equalsIgnoreCase("POST")) {

            sendResponse(exchange, 405,
                    """
                            {"status":"error","message":"Only GET & POST allowed"}
                            """);

            return;
        }

        // Request bhejne wale client ka IP nikala.
        String clientIp = exchange.getRemoteAddress().getAddress().getHostAddress();
        if (!isAllowed(clientIp)) {

            sendResponse(exchange, 429,
                    """
                            {"status":"error","message":"Too many requests"}
                            """);

            return;
        }

        try {

            // Authorization header Handler ko pass karne ke liye liya gaya.
            String authorizationHeader = exchange.getRequestHeaders().getFirst("Authorization");
            String clerkUserId = exchange.getRequestHeaders().getFirst("X-Clerk-User-Id");
            String accountStatus = exchange.getRequestHeaders().getFirst("X-Account-Status");

            String response = privacyRequestHandler.handle(method, authorizationHeader, clerkUserId, accountStatus);
            // System.out.println("Handler response: " + response);
            JsonObject responseObject = JsonParser.parseString(response).getAsJsonObject();
            int statusCode = responseObject.has("httpStatus")
                    ? responseObject.get("httpStatus").getAsInt()
                    : 500;
            responseObject.remove("httpStatus");

            sendResponse(exchange, statusCode, responseObject.toString());

        } catch (Exception e) {

            // System.err.println("Privacy request failed: " + e.getMessage());
            // e.printStackTrace();

            sendResponse(
                    exchange, 500,
                    """
                            {"status":"error","message":"Internal server error"}
                            """);
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] responseBytes = response.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", FRONTEND_URL);
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Clerk-User-Id, X-Account-Status");
        exchange.getResponseHeaders().set("Vary", "Origin");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "600");
        exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");

        if (statusCode == 204) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
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