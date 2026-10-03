package com.onego.account;

import java.sql.SQLException;

import java.util.HashMap;
import java.util.Map;

public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Map<String, Object> createAccount(
            String clerk_user_id,
            String photo,
            String full_name,
            String email_id,
            String provider) throws SQLException {

        Map<String, Object> response = new HashMap<>();

        if (clerk_user_id == null || clerk_user_id.isBlank()) {
            throw new IllegalArgumentException("Invalid Clerk user ID");
        }

        if (full_name == null || full_name.isBlank()) {
            throw new IllegalArgumentException("Invalid full name");
        }

        if (email_id == null || email_id.isBlank()) {
            throw new IllegalArgumentException("Invalid email");
        }

        if (provider == null || provider.isBlank()) {
            throw new IllegalArgumentException("Invalid provider");
        }

        full_name = full_name.trim();
        email_id = email_id.trim();
        provider = provider.trim();

        if (!EmailValidator.isValid(email_id)) {
            throw new IllegalArgumentException("Invalid email");
        }

        if (clerk_user_id.length() > 200) {
            throw new IllegalArgumentException("Invalid Clerk user ID");
        }

        if (full_name.length() > 200) {
            throw new IllegalArgumentException("Invalid full name");
        }

        if (email_id.length() > 320) {
            throw new IllegalArgumentException("Invalid email");
        }

        if (photo != null && photo.length() > 4000) {
            throw new IllegalArgumentException("Invalid photo");
        }

        // Clerk User ID already database mein hai?
        if (accountRepository.existsByClerkUserId(clerk_user_id)) {

            int searchId = accountRepository.getSearchIdByClerkUserId(clerk_user_id);

            if (searchId == -1) {
                throw new SQLException("Account search ID not found");
            }

            String name = accountRepository.getNameBySearchId(searchId);
            String email = accountRepository.getEmailIdBySearchId(searchId);
            String existingPhoto = accountRepository.getPhotoBySearchId(searchId);

            if (name == null || email == null) {
                throw new SQLException("Account data not found");
            }

            response.put("search_by_id", searchId);
            response.put("full_name", name);
            response.put("email_id", email);
            response.put("photo", existingPhoto);

            return response;
        }

        int searchId;

        // Agr nhi h to Unique Search ID generate karo.
        do {
            searchId = new SearchById().getSearchId();
        } while (accountRepository.existsBySearchId(searchId));

        // and Account database mein save karo.
        accountRepository.saveAccount(
                searchId,
                clerk_user_id,
                photo,
                full_name,
                email_id,
                provider);
        int savedSearchId = accountRepository.getSearchIdByClerkUserId(clerk_user_id);
        if (savedSearchId == -1) {
            throw new SQLException("Account was saved but search ID could not be retrieved");
        }

        String savedName = accountRepository.getNameBySearchId(savedSearchId);
        String savedEmail = accountRepository.getEmailIdBySearchId(savedSearchId);
        String savedPhoto = accountRepository.getPhotoBySearchId(savedSearchId);

        if (savedName == null) {
            throw new SQLException("Saved account name could not be retrieved");
        }

        if (savedEmail == null) {
            throw new SQLException("Saved account email could not be retrieved");
        }

        response.put("search_by_id", savedSearchId);
        response.put("full_name", savedName);
        response.put("email_id", savedEmail);
        response.put("photo", savedPhoto);

        return response;
    }
}
