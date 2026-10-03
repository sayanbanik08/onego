package com.onego.account;

import java.util.regex.Pattern;

public final class EmailValidator {

    private static final int MAX_EMAIL_LENGTH = 320;
    private static final int MAX_LOCAL_PART_LENGTH = 64;
    private static final int MAX_DOMAIN_PART_LENGTH = 255;

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*"
            +
            "@" +
            "(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    // Private constructor to prevent instantiation
    private EmailValidator() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated.");
    }

    /**
     * Validates if the given string is a strictly valid email address format.
     *
     * @param email Email input string
     * @return true if valid, false otherwise
     */
    public static boolean isValid(String email) {
        // 1. Null & Empty Check
        if (email == null) {
            return false;
        }

        String trimmedEmail = email.trim();

        if (trimmedEmail.isEmpty() || trimmedEmail.length() > MAX_EMAIL_LENGTH) {
            return false;
        }

        if (trimmedEmail.startsWith(".") || trimmedEmail.endsWith(".") || trimmedEmail.contains("..")) {
            return false;
        }

        // Ensure EXACTLY ONE '@' symbol exists
        int firstAt = trimmedEmail.indexOf('@');
        int lastAt = trimmedEmail.lastIndexOf('@');

        if (firstAt <= 0 || firstAt != lastAt || firstAt == trimmedEmail.length() - 1) {
            return false; // Missing '@', multiple '@', or '@' at start/end
        }

        // Separate Local Part and Domain Part for Granular Validation
        String localPart = trimmedEmail.substring(0, firstAt);
        String domainPart = trimmedEmail.substring(firstAt + 1);

        // Check Local & Domain Specific Lengths
        if (localPart.length() > MAX_LOCAL_PART_LENGTH || domainPart.length() > MAX_DOMAIN_PART_LENGTH) {
            return false;
        }

        // Domain Part specific quick checks (No hyphens at start/end of domain
        // labels)
        if (domainPart.startsWith("-") || domainPart.endsWith("-")) {
            return false;
        }

        // Final Strict Regex Matcher
        return EMAIL_PATTERN.matcher(trimmedEmail).matches();
    }
}

// EmailValidator ka main kaam hai check karna ki jo
// email aaya hai, uska format valid hai ya nahi.

// 1) Email null hai?
// if (email == null)
// → Invalid.

// 2) Email ko trim karta hai
// String trimmedEmail = email.trim();
// Starting/ending ke extra spaces hata deta hai.

// 3) Basic length check
// Empty nahi hona chahiye.
// Maximum 320 characters.

// 4) Dot (.) check:
// Invalid karega agar:
// .abc@gmail.com
// abc.@gmail.com
// abc..xyz@gmail.com

// 5) Exactly one @ check
// Valid:
// abc@gmail.com
// Invalid:
// abc@gmail.com@test.com
// abcgmail.com
// @gmail.com

// 6) Email ko 2 parts mein divide karta hai
// abc@gmail.com
//  ↑    ↑
// local domain
// abc = local part
// gmail.com = domain part

// 7) Length check karta hai
// Local part max 64
// Domain part max 255

// 8) Domain ke hyphen ko check karta hai
// Basic invalid cases jaise:
// -gmail.com
// gmail-.com

// 9) Finally Regex se detailed format check karta hai
// EMAIL_PATTERN.matcher(trimmedEmail).matches()
// Ye ensure karta hai ki email allowed characters aur proper domain structure
// follow kare.

// 10) EmailValidator = email ko database mein save karne se pehle
// check karta hai ki email structurally valid hai ya nahi.

// 11) Aur AccountService mein:
// if (!EmailValidator.isValid(email_id)) {
// throw new IllegalArgumentException("Invalid email");
// }
// iska matlab hai:
// EmailValidator if false → AccountService account creation rok dega.