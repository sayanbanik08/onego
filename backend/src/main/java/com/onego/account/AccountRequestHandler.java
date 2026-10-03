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

            RequestState requestState = AuthenticateRequest.authenticateRequest(
                    requestHeaders,
                    AuthenticateRequestOptions
                            .secretKey(DatabaseConnection.getEnv("CLERK_SECRET_KEY"))
                            .authorizedParty(DatabaseConnection.getEnv("FRONTEND_URL"))
                            .build());

            // Clerk token validation result check.
            if (!requestState.isSignedIn()) {
                System.out.println("Clerk token validation failed.");
                // System.out.println("Reason: " + requestState.reason());
                return """
                        {"status":"error","httpStatus":401,"message":"Invalid or expired authentication token"}
                        """;
            }

            // Valid Clerk token ke baad authentication successful.
            // System.out.println("Clerk token validation successful.");
            Optional<Claims> claims = requestState.claims();

            if (claims.isEmpty()) {
                return """
                        {"status":"error","httpStatus":401,"message":"Authentication claims not found"}
                        """;
            }

            verifiedClerkUserId = claims.get().getSubject();

        } catch (Exception e) {
            System.out.println("Clerk token validation error: " + e.getMessage());
            return """
                    {"status":"error","httpStatus":401,"message":"Authentication failed"}
                    """;
        }

        JsonObject jsonObject;
        try {
            jsonObject = JsonParser.parseString(json).getAsJsonObject();
        } catch (Exception e) {
            return """
                    {"status":"error","httpStatus":400,"message":"Invalid JSON"}
                    """;
        }

        String clerkUserId = getStringValue(jsonObject, "clerkUserId");
        String photo = getNullableStringValue(jsonObject, "photo");
        String fullName = getStringValue(jsonObject, "fullName");
        String emailId = getStringValue(jsonObject, "emailId");
        String provider = getNullableStringValue(jsonObject, "provider");

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

        boolean userDataVerified = clerkUserVerifier.verify(
                clerkUserId,
                photo,
                fullName,
                emailId,
                provider);
        // System.out.println("Clerk user data verification: " + userDataVerified);

        if (!userDataVerified) {
            return """
                    {"status":"error","httpStatus":403,"message":"User data verification failed"}
                    """;
        }

        try {
            Map<String, Object> result = accountService.createAccount(
                    clerkUserId,
                    photo,
                    fullName,
                    emailId,
                    provider);

            return mapToJson(result);

        } catch (SQLException e) {
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
