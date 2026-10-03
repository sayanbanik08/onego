package com.onego.account;

import java.util.concurrent.ThreadLocalRandom;

public class SearchById {

    private final int searchId;

    public SearchById() {
        this.searchId = generateSearchId();
    }

    /**
     * Generated Search ID ko return karta hai.
     */
    public int getSearchId() {
        return searchId;
    }

    // 6 digit ka random Search ID generate karta hai.
    private int generateSearchId() {

        // 100000 inclusive hai aur 1000000 exclusive.
        // Isliye hamesha 100000 se 999999 ke beech number milega.
        return ThreadLocalRandom.current().nextInt(100000, 1000000);
    }
}
