use engager;

DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS registration;
DROP TABLE IF EXISTS account;

CREATE TABLE IF NOT EXISTS account (
    account_id INT AUTO_INCREMENT,
    account_key VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (account_id)
)  ENGINE=INNODB;

ALTER TABLE `account` ADD UNIQUE `account_key_unique`(`account_key`);


CREATE TABLE IF NOT EXISTS registration (
    registration_id INT AUTO_INCREMENT,
    account_id INT,
    email VARCHAR(255) NOT NULL ,
    INDEX account_id_ind (account_id),
    PRIMARY KEY (registration_id),
    FOREIGN KEY (account_id)
           REFERENCES account(account_id)
           ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS profile (
    profile_id INT AUTO_INCREMENT,
    account_id INT,
    publishing_type INT,
    json BLOB,
    INDEX account_id_ind (account_id),
    PRIMARY KEY (profile_id),
    FOREIGN KEY (account_id)
           REFERENCES account(account_id)
           ON DELETE CASCADE
)  ENGINE=INNODB;

ALTER TABLE `profile` ADD UNIQUE `publishing_unique`(`publishing_type`, `account_id`);


CREATE TABLE IF NOT EXISTS image (
    image_id INT AUTO_INCREMENT,
    account_id INT,
    publishing_type INT,
    uuid VARCHAR(255) NOT NULL,
    meta TEXT,
    content_type TEXT,
    content MEDIUMBLOB NOT NULL,
    INDEX account_id_ind (account_id),
    PRIMARY KEY (image_id),
    FOREIGN KEY (account_id)
           REFERENCES account(account_id)
           ON DELETE CASCADE
)  ENGINE=INNODB;

ALTER TABLE `image` ADD UNIQUE `publishing_unique`(`publishing_type`, `uuid`);



INSERT INTO account ( account_key ) VALUES ( "c812d825-452b-4494-b41b-1662846a4919" );

INSERT INTO registration (email, account_id) 
SELECT "picorgdevtest@gmail.com", account_id 
FROM account WHERE account.account_key = "c812d825-452b-4494-b41b-1662846a4919"
;



  
