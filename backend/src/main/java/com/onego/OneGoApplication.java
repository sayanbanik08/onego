package com.onego;

import com.onego.account.AccountDetailsGetter;
import com.onego.account.AccountRepository;
import com.onego.account.AccountRequestHandler;
import com.onego.account.AccountService;
import com.onego.db.DatabaseInitializer;

import com.onego.privacy.PrivacyDetailsGetter;
import com.onego.privacy.PrivacyRepository;
import com.onego.privacy.PrivacyRequestHandler;
import com.onego.privacy.PrivacyService;

public class OneGoApplication {

    public static void main(String[] args) throws Exception {

        DatabaseInitializer.initialize();

        AccountRepository accountRepository = new AccountRepository();

        AccountService accountService = new AccountService(accountRepository);

        AccountRequestHandler accountRequestHandler = new AccountRequestHandler(accountService);

        AccountDetailsGetter accountDetailsGetter = new AccountDetailsGetter(accountRequestHandler);

        PrivacyRepository privacyRepository = new PrivacyRepository();

        PrivacyService privacyService = new PrivacyService(privacyRepository);

        PrivacyRequestHandler privacyRequestHandler = new PrivacyRequestHandler(privacyService);

        new PrivacyDetailsGetter(privacyRequestHandler, accountDetailsGetter.getServer());
    }
}

// ye mera backend ka starting pont hain.

// Flow Account:

// Frontend
// ↓
// POST /api/account
// ↓
// Backend
// ↓
// DatabaseInitializer
// ↓
// accDetailsGetter
// ↓
// AccountRequestHandler
// ↓
// AccountService
// ↓
// AccountRepository
// ↓
// MySQL

// Flow privacy:
// HTTP Request → PrivacyDetailsGetter → PrivacyRequestHandler → PrivacyService
// → PrivacyRepository → Database