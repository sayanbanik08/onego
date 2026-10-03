package com.onego.account;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.components.EmailAddress;
import com.clerk.backend_api.models.components.ExternalAccountWithVerification;
import com.clerk.backend_api.models.components.User;
import com.clerk.backend_api.models.operations.GetUserResponse;
import com.onego.db.DatabaseConnection;

import java.util.List;
import java.util.Optional;

public class ClerkUserVerifier {

    private final Clerk clerk;

    public ClerkUserVerifier() {
        this.clerk = Clerk.builder()
                .bearerAuth(DatabaseConnection.getEnv("CLERK_SECRET_KEY"))
                .build();
    }

    public boolean verify(
            String clerkUserId,
            String photo,
            String fullName,
            String emailId,
            String provider) {

        try {

            GetUserResponse response = clerk.users().get(clerkUserId);

            if (response.statusCode() != 200) {
                return false;
            }

            Optional<User> userOptional = response.user();

            if (userOptional.isEmpty()) {
                return false;
            }

            User user = userOptional.get();

            String actualFullName = buildFullName(
                    user.firstName(),
                    user.lastName());

            String actualEmail = getPrimaryEmail(user);

            String actualPhoto = user.imageUrl().orElse(null);

            String actualProvider = getProvider(user);

            return equalsNullable(fullName, actualFullName)
                    && equalsNullable(emailId, actualEmail)
                    && equalsNullable(photo, actualPhoto)
                    && equalsNullable(provider, actualProvider);

        } catch (Exception e) {

            System.out.println(
                    "Clerk user verification error: " + e.getMessage());

            return false;
        }
    }

    private String buildFullName(
            Optional<String> firstName,
            Optional<String> lastName) {

        String first = firstName.orElse("");
        String last = lastName.orElse("");

        String fullName = (first + " " + last).trim();

        return fullName.isEmpty() ? null : fullName;
    }

    private String getPrimaryEmail(User user) {

        Optional<String> primaryEmailId = user.primaryEmailAddressId();

        if (primaryEmailId.isEmpty()) {
            return null;
        }

        for (EmailAddress email : user.emailAddresses()) {

            if (primaryEmailId.get().equals(email.id().orElse(null))) {
                return email.emailAddress();
            }
        }

        return null;
    }

    private String getProvider(User user) {

        List<ExternalAccountWithVerification> accounts = user.externalAccounts();

        if (accounts.isEmpty()) {
            return null;
        }

        return accounts.get(0).provider();
    }

    private boolean equalsNullable(String first, String second) {

        if (first == null && second == null) {
            return true;
        }

        if (first == null || second == null) {
            return false;
        }

        return first.equals(second);
    }
}
