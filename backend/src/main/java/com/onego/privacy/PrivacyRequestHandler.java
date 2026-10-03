package com.onego.privacy;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.clerk.backend_api.helpers.security.AuthenticateRequest;
import com.clerk.backend_api.helpers.security.models.AuthenticateRequestOptions;
import com.clerk.backend_api.helpers.security.models.RequestState;
import com.onego.db.DatabaseConnection;

import io.jsonwebtoken.Claims;

public class PrivacyRequestHandler {

        private final PrivacyService privacyService;

        public PrivacyRequestHandler(PrivacyService privacyService) {
                this.privacyService = privacyService;
        }

        public String handle(String method, String authorizationHeader, String clerkUserId, String accountStatus) {

                // Authorization header missing hone par request reject.
                if (authorizationHeader == null || authorizationHeader.isBlank()) {
                        return """
                                                {
                                                    "status":"error",
                                                    "message":"Authorization header is required",
                                                    "httpStatus":401
                                                }
                                        """;
                }


                String verifiedClerkUserId = null;

                try {

                        Map<String, List<String>> requestHeaders = Map.of("Authorization",
                                        List.of(authorizationHeader));

                        RequestState requestState = AuthenticateRequest.authenticateRequest(
                                        requestHeaders,
                                        AuthenticateRequestOptions
                                                        .secretKey(DatabaseConnection.getEnv("CLERK_SECRET_KEY"))
                                                        .authorizedParty(DatabaseConnection.getEnv("FRONTEND_URL"))
                                                        .build());

                        // Clerk token validation result check.
                        if (!requestState.isSignedIn()) {
                                System.out.println("Clerk token validation failed for privacy request.");
                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Invalid or expired authentication token",
                                                            "httpStatus":401
                                                        }
                                                """;
                        }
                        // System.out.println("Clerk token validation successful for privacy request.");
                        Optional<Claims> claims = requestState.claims();

                        if (claims.isEmpty()) {
                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Authentication claims not found",
                                                            "httpStatus":401
                                                        }
                                                """;
                        }

                        // Authenticated Clerk user ID token ke subject se milega.
                        verifiedClerkUserId = claims.get().getSubject();

                } catch (Exception e) {
                        return """
                                                {
                                                    "status":"error",
                                                    "message":"Authentication failed",
                                                    "httpStatus":401
                                                }
                                        """;
                }

                if (verifiedClerkUserId == null || verifiedClerkUserId.isBlank()) {
                        return """
                                                {
                                                    "status":"error",
                                                    "message":"Authentication subject not found",
                                                    "httpStatus":401
                                                }
                                        """;
                }

                // Request se aaye clerkUserId ko authenticated user se compare karo.
                if (clerkUserId == null || clerkUserId.isBlank()) {
                        return """
                                                {
                                                    "status":"error",
                                                    "message":"Missing request data",
                                                    "httpStatus":400
                                                }
                                        """;
                }

                if (!verifiedClerkUserId.equals(clerkUserId)) {
                        return """
                                                {
                                                    "status":"error",
                                                    "message":"Clerk user ID does not match authentication token",
                                                    "httpStatus":403
                                                }
                                        """;
                }

                if ("GET".equalsIgnoreCase(method)) {

                        try {

                                String currentStatus = privacyService.getPrivacyStatus(verifiedClerkUserId);

                                if (currentStatus == null) {
                                        return """
                                                                {
                                                                    "status":"error",
                                                                    "message":"Account not found",
                                                                    "httpStatus":404
                                                                }
                                                        """;
                                }

                                return """
                                                        {
                                                            "account_status":"%s",
                                                            "httpStatus":200
                                                        }
                                                """.formatted(currentStatus);

                        } catch (Exception e) {

                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Unable to get privacy status",
                                                            "httpStatus":500
                                                        }
                                                """;
                        }
                }

                if ("POST".equalsIgnoreCase(method)) {
                        // System.out.println("PRIVACY POST RECEIVED");
                        // System.out.println("accountStatus = " + accountStatus);

                        if (accountStatus == null || accountStatus.isBlank()) {
                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Missing request data",
                                                            "httpStatus":400
                                                        }
                                                """;
                        }

                        if (!"PUBLIC".equals(accountStatus) && !"PRIVATE".equals(accountStatus)) {
                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Invalid account status value",
                                                            "httpStatus":400
                                                        }
                                                """;
                        }

                        try {
                                // System.out.println("Calling updatePrivacy...");

                                boolean updated = privacyService.updatePrivacy(verifiedClerkUserId, accountStatus);

                                if (!updated) {
                                        return """
                                                                {
                                                                    "status":"error",
                                                                    "message":"Unexpected error occurred while updating privacy",
                                                                    "httpStatus":404
                                                                }
                                                        """;
                                }

                                String updatedStatus = privacyService.getPrivacyStatus(verifiedClerkUserId);
                                if (updatedStatus == null) {
                                        return """
                                                        {
                                                            "status":"error",
                                                            "message":"Unable to get updated privacy status",
                                                            "httpStatus":500
                                                        }
                                                        """;
                                }
                                // System.out.println("updatePrivacy returned: " + updated);

                                return """
                                                        {
                                                            "status":"success",
                                                            "account_status":"%s",
                                                            "message":"Privacy updated",
                                                            "httpStatus":200
                                                        }
                                                """.formatted(updatedStatus);

                        } catch (Exception e) {
                                // System.err.println("Privacy update failed: " + e.getMessage());
                                // e.printStackTrace();

                                return """
                                                        {
                                                            "status":"error",
                                                            "message":"Unable to update privacy",
                                                            "httpStatus":500
                                                        }
                                                """;
                        }
                }

                return """
                                        {
                                            "status":"error",
                                            "message":"Method not allowed",
                                            "httpStatus":405
                                        }
                                """;
        }
}