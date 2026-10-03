CREATE TABLE IF NOT EXISTS Account (
    search_by_id INT UNSIGNED NOT NULL,
    clerk_user_id VARCHAR(200) NOT NULL,
    photo VARCHAR(4000),
    full_name VARCHAR(200) NOT NULL,
    email_id VARCHAR(320) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    account_status VARCHAR(10) NOT NULL DEFAULT 'PUBLIC',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (search_by_id),

    UNIQUE KEY uq_account_clerk_user_id (clerk_user_id),
    UNIQUE KEY uq_account_email_id (email_id),
    CHECK (account_status IN ('PUBLIC', 'PRIVATE'))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Search (
    search_by_id INT UNSIGNED NOT NULL,
    search_by_id_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (search_by_id),

    CONSTRAINT fk_search_account
        FOREIGN KEY (search_by_id)
        REFERENCES Account(search_by_id)
        ON DELETE CASCADE,

    CHECK (search_by_id_status IN ('ACTIVE', 'INACTIVE'))
) ENGINE=InnoDB;