-- 13.5.2019 --
DROP TABLE IF EXISTS customer_order;

CREATE TABLE IF NOT EXISTS customer_order (
    order_id INT AUTO_INCREMENT,
    account_id INT,
    publishing_type INT,
    order_status INT,
    key_uuid VARCHAR(255) NOT NULL,
    sender_ip VARCHAR(255) NOT NULL,
    json BLOB,
    create_time LONG  NOT NULL,
    client_valid_to_time LONG ,
    user_code VARCHAR(255) NOT NULL,
    INDEX account_id_ind (account_id),
    PRIMARY KEY (order_id),
    FOREIGN KEY (account_id)
           REFERENCES account(account_id)
           ON DELETE CASCADE
)  ENGINE=INNODB;

ALTER TABLE `customer_order` ADD UNIQUE `key_uuid_unique`(`key_uuid`);
ALTER TABLE `customer_order` ADD UNIQUE `user_code_unique`(`user_code`, `account_id`, `order_status`, `publishing_type`);
    
DROP TABLE IF EXISTS promocode;

CREATE TABLE IF NOT EXISTS promocode (
    promocode_id INT AUTO_INCREMENT,
    account_id INT,
    publishing_type INT,
    user_code VARCHAR(255) NOT NULL,
    json BLOB,
    INDEX account_id_ind (account_id),
    PRIMARY KEY (promocode_id),
    FOREIGN KEY (account_id)
           REFERENCES account(account_id)
           ON DELETE CASCADE
)  ENGINE=INNODB;


