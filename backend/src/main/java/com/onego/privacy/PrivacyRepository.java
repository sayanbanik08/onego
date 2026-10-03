package com.onego.privacy;

import com.onego.db.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PrivacyRepository {

    public Integer findSearchById(String clerkUserId) throws SQLException {

        String sql = """
                SELECT search_by_id
                FROM Account
                WHERE clerk_user_id = ?
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, clerkUserId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getInt("search_by_id");
                }

                return null;
            }
        }
    }

    public String getAccountStatus(int searchById) throws SQLException {

        String sql = """
                SELECT account_status
                FROM Account
                WHERE search_by_id = ?
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchById);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getString("account_status");
                }

                return null;
            }
        }
    }

    public void ensureSearchRow(int searchById) throws SQLException {

        String sql = """
                INSERT INTO Search (
                    search_by_id,
                    search_by_id_status
                )
                SELECT
                    search_by_id,
                    CASE
                        WHEN account_status = 'PUBLIC' THEN 'ACTIVE'
                        ELSE 'INACTIVE'
                    END
                FROM Account
                WHERE search_by_id = ?
                ON DUPLICATE KEY UPDATE
                    search_by_id = Search.search_by_id
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchById);
            statement.executeUpdate();
        }
    }

    public void updatePrivacyStatus(
            int searchById,
            String accountStatus,
            String searchByIdStatus) throws SQLException {

        String currentStatusSql = """
                SELECT account_status
                FROM Account
                WHERE search_by_id = ?
                FOR UPDATE
                """;

        String accountSql = """
                UPDATE Account
                SET account_status = ?
                WHERE search_by_id = ?
                """;

        String searchSql = """
                UPDATE Search
                SET search_by_id_status = ?
                WHERE search_by_id = ?
                """;

        try (Connection connection = DatabaseConnection.getConnection()) {
            boolean originalAutoCommit = connection.getAutoCommit();

            try (

                    PreparedStatement currentStatusStatement = connection.prepareStatement(currentStatusSql);
                    PreparedStatement accountStatement = connection.prepareStatement(accountSql);
                    PreparedStatement searchStatement = connection.prepareStatement(searchSql)) {

                connection.setAutoCommit(false);

                currentStatusStatement.setInt(1, searchById);

                String currentStatus;

                try (ResultSet resultSet = currentStatusStatement.executeQuery()) {
                    if (!resultSet.next()) {
                        throw new SQLException("Account not found");
                    }
                    currentStatus = resultSet.getString("account_status");
                }

                if (accountStatus.equals(currentStatus)) {
                    throw new SQLException("Account status is already set to " + accountStatus);
                }

                accountStatement.setString(1, accountStatus);
                accountStatement.setInt(2, searchById);
                int accountRows = accountStatement.executeUpdate();
                if (accountRows != 1) {
                    throw new SQLException("Account privacy status was not updated");
                }

                searchStatement.setString(1, searchByIdStatus);
                searchStatement.setInt(2, searchById);
                int searchRows = searchStatement.executeUpdate();

                if (searchRows != 1) {
                    throw new SQLException("Search status was not updated");
                }

                connection.commit();

            } catch (SQLException e) {

                try {
                    connection.rollback();
                } catch (SQLException rollbackException) {
                    e.addSuppressed(rollbackException);
                }
                throw e;

            } finally {
                connection.setAutoCommit(originalAutoCommit);
            }
        }
    }
}