package com.onego.db;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseInitializer {

    private DatabaseInitializer() {
    }

    public static void initialize() throws SQLException {

        createDatabase();
        executeSchema();
    }

    private static void createDatabase() throws SQLException {

        String url = DatabaseConnection.getEnv("DB_URL");
        String cleanUrl = url.split("\\?", 2)[0];
        String databaseName = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);

        // Local database: create onego if it does not exist.
        // Hosted database: Railway already provides the database.
        if (!"onego".equalsIgnoreCase(databaseName)) {
            return;
        }

        try (
                Connection connection = DatabaseConnection.getServerConnection();
                Statement statement = connection.createStatement()) {

            statement.executeUpdate(
                    "CREATE DATABASE IF NOT EXISTS onego");
        }
    }

    private static void executeSchema() throws SQLException {

        String schema;

        try {

            schema = Files.readString(
                    Path.of("src", "main", "resources", "db", "schema.sql"),
                    StandardCharsets.UTF_8);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to load schema.sql",
                    e);
        }

        try (
                Connection connection = DatabaseConnection.getConnection();
                Statement statement = connection.createStatement()) {

            for (String sql : schema.split(";")) {
                sql = sql.trim();

                if (!sql.isEmpty()) {
                    statement.execute(sql);
                }
            }
        }
    }
}

// OneGoApplication
// ↓
// DatabaseInitializer.initialize()
// ↓
// createDatabase()
// ↓
// onego database ready
// ↓
// executeSchema()
// ↓
// schema.sql read
// ↓
// schema.sql execute
// ↓
// Tables ready