package com.onego.db;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class DatabaseConnection {

    private static final Map<String, String> ENV = loadEnv();

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {

        String url = ENV.get("DB_URL");
        String user = ENV.get("DB_USER");
        String password = ENV.get("DB_PASSWORD");

        return DriverManager.getConnection(url, user, password);
    }

    public static String getEnv(String key) {
        return ENV.get(key);
    }

    public static Connection getServerConnection() throws SQLException {

        String url = ENV.get("DB_URL");
        String user = ENV.get("DB_USER");
        String password = ENV.get("DB_PASSWORD");

        // DB_URL ka basic format validate karo
        if (!url.startsWith("jdbc:mysql://")) {
            throw new RuntimeException(
                    "Invalid DB_URL: MySQL JDBC URL required");
        }

        // Query parameters alag karo
        int queryIndex = url.indexOf('?');
        String baseUrl;
        String properties = "";

        if (queryIndex >= 0) {
            baseUrl = url.substring(0, queryIndex);
            properties = url.substring(queryIndex);
        } else {
            baseUrl = url;
        }

        int lastSlash = baseUrl.lastIndexOf('/');

        // URL mein database name hona required hai
        if (lastSlash <= "jdbc:mysql://".length()
                || lastSlash == baseUrl.length() - 1) {
            throw new RuntimeException(
                    "Invalid DB_URL: database name is required");
        }

        String serverUrl = baseUrl.substring(0, lastSlash) + properties;

        return DriverManager.getConnection(
                serverUrl,
                user,
                password);
    }

    private static Map<String, String> loadEnv() {

        Map<String, String> env = new HashMap<>();

        try {
            for (String line : Files.readAllLines(Path.of(".env.local"))) {

                line = line.trim();

                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }

                String[] parts = line.split("=", 2);

                if (parts.length == 2) {
                    env.put(parts[0].trim(), parts[1].trim());
                }
            }
            // Required database configuration validate karo
            String[] requiredKeys = {
                    "DB_URL",
                    "DB_USER",
                    "DB_PASSWORD",
                    "FRONTEND_URL",
                    "CLERK_SECRET_KEY"
            };

            for (String key : requiredKeys) {

                String value = env.get(key);

                if (value == null || value.isBlank()) {
                    throw new RuntimeException(
                            "Missing required database configuration: " + key);
                }
            }

            return env;

        } catch (IOException e) {
            throw new RuntimeException("Unable to load .env.local", e);
        }
    }
}

// ye file mera mySql database ke saath connection
// establish karne ke liye use hoti hain. env file
// ke andar database ka url, user aur password
// store kiya h aur ye file unko read karke connection
// establish karne ke liye use hoti hain.
