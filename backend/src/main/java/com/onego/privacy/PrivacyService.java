package com.onego.privacy;

import java.sql.SQLException;

public class PrivacyService {

    private final PrivacyRepository privacyRepository;

    public PrivacyService(PrivacyRepository privacyRepository) {
        this.privacyRepository = privacyRepository;
    }

    public String getPrivacyStatus(String clerkUserId) throws SQLException {

        if (clerkUserId == null || clerkUserId.isBlank()) {
            throw new IllegalArgumentException("Unable to get privacy status");
        }

        Integer searchById = privacyRepository.findSearchById(clerkUserId);

        if (searchById == null) {
            return null;
        }

        return privacyRepository.getAccountStatus(searchById);
    }

    public boolean updatePrivacy(String clerkUserId, String accountStatus) throws SQLException {

        if (clerkUserId == null || clerkUserId.isBlank()) {
            throw new IllegalArgumentException("Unable to update privacy status");
        }

        if (accountStatus == null || accountStatus.isBlank()) {
            throw new IllegalArgumentException("Invalid account status");
        }

        if (!"PUBLIC".equals(accountStatus) && !"PRIVATE".equals(accountStatus)) {
            throw new IllegalArgumentException("Invalid account status value");
        }

        Integer searchById = privacyRepository.findSearchById(clerkUserId);

        if (searchById == null) {
            return false;
        }

        privacyRepository.ensureSearchRow(searchById);

        String searchByIdStatus;

        if ("PUBLIC".equals(accountStatus)) {
            searchByIdStatus = "ACTIVE";
        } else {
            searchByIdStatus = "INACTIVE";
        }

        privacyRepository.updatePrivacyStatus(
                searchById,
                accountStatus,
                searchByIdStatus);

        return true;
    }
}
