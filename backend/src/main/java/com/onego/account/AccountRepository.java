package com.onego.account;

import com.onego.db.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountRepository {

    // Clerk User ID already database mein hai ya nahi check karta hai.
    public boolean existsByClerkUserId(String clerkUserId) throws SQLException {

        String sql = """
                SELECT 1
                FROM Account
                WHERE clerk_user_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, clerkUserId);

            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next();
            }
        }
    }

    // Search ID already database mein hai ya nahi check karta hai.
    public boolean existsBySearchId(int searchId) throws SQLException {

        String sql = """
                SELECT 1
                FROM Account
                WHERE search_by_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchId);

            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next();
            }
        }
    }

    // Database mein naya account create (save) karta hai.
    public void saveAccount(
            int search_by_id,
            String clerk_user_id,
            String photo,
            String full_name,
            String email_id,
            String provider) throws SQLException {

        String sql = """
                INSERT INTO Account
                (search_by_id, clerk_user_id, photo, full_name, email_id, provider)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, search_by_id);
            statement.setString(2, clerk_user_id);
            statement.setString(3, photo);
            statement.setString(4, full_name);
            statement.setString(5, email_id);
            statement.setString(6, provider);

            statement.executeUpdate();
        }
    }

    public int getSearchIdByClerkUserId(String clerk_user_id) throws SQLException {

        String sql = """
                SELECT search_by_id
                FROM Account
                WHERE clerk_user_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, clerk_user_id);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getInt("search_by_id");
                }
            }
        }

        return -1;
    }

    public String getNameBySearchId(int searchId) throws SQLException {

        String sql = """
                SELECT full_name
                FROM Account
                WHERE search_by_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getString("full_name");
                }
            }
        }

        return null;
    }

    public String getEmailIdBySearchId(int searchId) throws SQLException {

        String sql = """
                SELECT email_id
                FROM Account
                WHERE search_by_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getString("email_id");
                }
            }
        }

        return null;
    }

    public String getPhotoBySearchId(int searchId) throws SQLException {

        String sql = """
                SELECT photo
                FROM Account
                WHERE search_by_id = ?
                LIMIT 1
                """;

        try (
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, searchId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return resultSet.getString("photo");
                }
            }
        }

        return null;
    }
}
