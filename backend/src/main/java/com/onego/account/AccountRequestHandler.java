package com.onego.account;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import com.clerk.backend_api.helpers.security.AuthenticateRequest;
import com.clerk.backend_api.helpers.security.models.AuthenticateRequestOptions;
import com.clerk.backend_api.helpers.security.models.RequestState;
import io.jsonwebtoken.Claims;
import java.util.Optional;

import com.onego.db.DatabaseConnection;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class AccountRequestHandler {

    private final AccountService accountService;
    private final ClerkUserVerifier clerkUserVerifier;

    public AccountRequestHandler(AccountService accountService) {
        this.accountService = accountService;
        this.clerkUserVerifier = new ClerkUserVerifier();

    }

    public String handle(String json, String authorizationHeader) throws SQLException {
        System.out.println("ACCOUNT API REQUEST RECEIVED");

        // Authorization header missing hone par request reject.
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return """
                        {"status":"error","httpStatus":401,"message":"Authorization header is required"}
                    """;
        }

        // Authorization header ko temporary debug ke liye print kiya gaya.
        // System.out.println("Authorization header received: " + authorizationHeader);

        String verifiedClerkUserId = null;

        try {

            Map<String, List<String>> requestHeaders = Map.of(
                    "Authorization",
                    List.of(authorizationHeader));
            System.out.println("Starting Clerk token validation...");

            RequestState requestState = AuthenticateRequest.authenticateRequest(
                    requestHeaders,
                    AuthenticateRequestOptions
                            .secretKey(DatabaseConnection.getEnv("CLERK_SECRET_KEY"))
                            .authorizedParty(DatabaseConnection.getEnv("FRONTEND_URL"))
                            .build());
            System.out.println("Clerk validation call completed.");

            // Clerk token validation result check.
            if (!requestState.isSignedIn()) {
                System.out.println("Clerk token validation failed.");
                return """
                        {"status":"error","httpStatus":401,"message":"Invalid or expired authentication token"}
                        """;
            }
            System.out.println("Clerk signed-in status: " + requestState.isSignedIn());

            // Valid Clerk token ke baad authentication successful.
            // System.out.println("Clerk token validation successful.");
            Optional<Claims> claims = requestState.claims();

            if (claims.isEmpty()) {
                System.out.println("Clerk token has no authentication claims.");
                return """
                        {"status":"error","httpStatus":401,"message":"Authentication claims not found"}
                        """;
            }

            verifiedClerkUserId = claims.get().getSubject();

        } catch (Exception e) {
            System.err.println("Clerk token validation error type: " + e.getClass().getSimpleName());
            return """
                    {"status":"error","httpStatus":401,"message":"Authentication failed"}
                    """;
        }

        JsonObject jsonObject;
        try {
            jsonObject = JsonParser.parseString(json).getAsJsonObject();
        } catch (Exception e) {
            System.out.println("Account request JSON parsing failed.");
            return """
                    {"status":"error","httpStatus":400,"message":"Invalid JSON"}
                    """;
        }

        String clerkUserId = getStringValue(jsonObject, "clerkUserId");
        String photo = getNullableStringValue(jsonObject, "photo");
        String fullName = getStringValue(jsonObject, "fullName");
        String emailId = getStringValue(jsonObject, "emailId");
        String provider = getNullableStringValue(jsonObject, "provider");
        System.out.println("Account request parsed; providerPresent=" + (provider != null && !provider.isBlank()));

        if (clerkUserId == null || clerkUserId.isBlank()) {
            return """
                    {"status":"error","httpStatus":400,"message":"clerkUserId is required"}
                    """;
        }

        if (verifiedClerkUserId == null || verifiedClerkUserId.isBlank()) {
            return """
                    {"status":"error","httpStatus":401,"message":"Authentication subject not found"}
                    """;
        }

        if (!verifiedClerkUserId.equals(clerkUserId)) {
            return """
                    {"status":"error","httpStatus":403,"message":"Clerk user ID does not match authentication token"}
                    """;
        }

        if (fullName == null || fullName.isBlank()) {
            return """
                    {"status":"error","httpStatus":400,"message":"fullName is required"}
                    """;
        }

        if (emailId == null || emailId.isBlank()) {
            return """
                    {"status":"error","httpStatus":400,"message":"emailId is required"}
                    """;
        }

        System.out.println("Starting Clerk account data verification.");
        boolean userDataVerified = clerkUserVerifier.verify(
                clerkUserId,
                photo,
                fullName,
                emailId,
                provider);

        if (!userDataVerified) {
            System.out.println("Clerk account data verification failed.");
            return """
                    {"status":"error","httpStatus":403,"message":"User data verification failed"}
                    """;
        }
        System.out.println("Clerk account data verification succeeded.");

        try {
            System.out.println("Starting account service operation.");
            Map<String, Object> result = accountService.createAccount(
                    clerkUserId,
                    photo,
                    fullName,
                    emailId,
                    provider);

            System.out.println("Account service operation succeeded.");
            return mapToJson(result);

        } catch (SQLException e) {
            System.err.printf(
                "Account persistence failed: type=%s sqlState=%s vendorCode=%d%n",
                e.getClass().getSimpleName(),
                e.getSQLState(),
                e.getErrorCode());
            return """
                {"status":"error","httpStatus":500,"message":"Internal server error"}
                """;
        } catch (RuntimeException e) {
            System.err.println("Account service failed: type=" + e.getClass().getSimpleName());
            return """
                    {"status":"error","httpStatus":500,"message":"Internal server error"}
                    """;
        }
    }

    private String getStringValue(JsonObject jsonObject, String key) {
        if (!jsonObject.has(key)
                || jsonObject.get(key).isJsonNull()
                || !jsonObject.get(key).isJsonPrimitive()
                || !jsonObject.get(key).getAsJsonPrimitive().isString()) {
            return null;
        }
        return jsonObject.get(key).getAsString();
    }

    private String getNullableStringValue(JsonObject jsonObject, String key) {
        if (!jsonObject.has(key)
                || jsonObject.get(key).isJsonNull()) {
            return null;
        }
        if (!jsonObject.get(key).isJsonPrimitive()
                || !jsonObject.get(key).getAsJsonPrimitive().isString()) {
            return null;
        }
        return jsonObject.get(key).getAsString();
    }

    private String mapToJson(Map<String, Object> result) {

        Object searchId = result.get("search_by_id");
        Object photo = result.get("photo");

        return "{"
                + "\"search_by_id\":" + searchId
                + ",\"httpStatus\":200"
                + ",\"full_name\":\"" + escapeJson(String.valueOf(result.get("full_name"))) + "\""
                + ",\"email_id\":\"" + escapeJson(String.valueOf(result.get("email_id"))) + "\""
                + ",\"photo\":"
                + (photo == null ? "null" : "\"" + escapeJson(String.valueOf(photo)) + "\"")
                + "}";
    }

    private String escapeJson(String value) {

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}
