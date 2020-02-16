DROP DATABASE IF EXISTS esportsClothing;
CREATE DATABASE IF NOT EXISTS esportsClothing;
USE esportsClothing;

DROP USER IF EXISTS 'esportsClothing'@'localhost';
CREATE USER 'esportsClothing'@'localhost' IDENTIFIED BY 'L3W15 35P0RT5';
GRANT SELECT, INSERT, UPDATE, DELETE ON esportsClothing.* TO 'esportsClothing'@'localhost';

DROP TABLE IF EXISTS members;
CREATE TABLE members (
    memberId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    email VARCHAR(30) DEFAULT NULL,
    phone CHAR(10) DEFAULT NULL,
    discordName VARCHAR(37) DEFAULT NULL,
    dateJoined DATE DEFAULT CURRENT_DATE()
); 
CREATE INDEX members_lastName ON members(lastName);
CREATE INDEX members_name ON members(firstName, lastName);

DROP TABLE IF EXISTS clothing;
CREATE TABLE clothing (
    clothingId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    clothingType VARCHAR(30) NOT NULL,
    clothingColor VARCHAR(15) NOT NULL,
    clothingPrice INT NOT NULL
);
CREATE INDEX clothing_clothingPrice ON clothing(clothingPrice);

DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
    teamId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamName VARCHAR(60) NOT NULL
);

DROP TABLE IF EXISTS dues;
CREATE TABLE dues (
    dueId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    memberId INT NOT NULL,
    amountPaid INT NOT NULL,
    datePaid DATE DEFAULT CURRENT_DATE(),
    CONSTRAINT dues_fk_members FOREIGN KEY(memberId)
        REFERENCES members(memberId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
CREATE INDEX dues_amountPaid ON dues(amountPaid);

DROP TABLE IF EXISTS clothingOrder;
CREATE TABLE clothingOrder (
    orderId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    memberId INT NOT NULL,
    clothingId INT NOT NULL,
    clothingSize VARCHAR(3) NOT NULL,
    orderDate DATE DEFAULT CURRENT_DATE(),
    CONSTRAINT clothingOrder_fk_members FOREIGN KEY(memberId)
        REFERENCES members(memberId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT clothingOrder_fk_clothing FOREIGN KEY(clothingId)
        REFERENCES clothing(clothingId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
CREATE INDEX clothingOrder_clothingSize ON clothingOrder(clothingSize);

DROP TABLE IF EXISTS dues;
CREATE TABLE dues (
    dueId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    memberId INT,
    amountPaid INT NOT NULL,
    datePaid DATE DEFAULT CURRENT_DATE(),
    CONSTRAINT dues_fk_members FOREIGN KEY(memberId)
        REFERENCES members(memberId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS registration;
CREATE TABLE registration (
    registrationId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    memberId INT,
    teamId INT,
    registrationStatus VARCHAR(7) NOT NULL,
    dateRegistered DATE DEFAULT CURRENT_DATE(),
    CONSTRAINT registration_fk_members FOREIGN KEY(memberId)
        REFERENCES members(memberId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT registration_fk_teams FOREIGN KEY(teamId)
        REFERENCES teams(teamId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS team;
CREATE TABLE team (
	teamId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	teamName varchar(60) NOT NULL
);

INSERT INTO members (firstName, lastName, email, phone, discordName) VALUES("Tyler", "Starkus", "tylerjstarkus@lewisu.edu", 8156307194, "Ty#1635");
INSERT INTO members (firstName, lastName, email, discordName) VALUES("Leonard", "Lucheck", "leonardjlucheck@lewisu.edu", "\[LU\]KepperJohnson#1128");
INSERT INTO members (firstName, lastName, email, discordName) VALUES("Michael", "Bojarski", "michaeldbojarski@lewisu.edu", "GamerFromHeck#3019");
INSERT INTO members (firstName, lastName, email, discordName) VALUES("Brendan", "Cagampang", "brendanhcagampang@lewisu.edu", "iReekHavok#1168");
INSERT INTO members (firstName, lastName, email, discordName) VALUES("Yesenia", "Gonzalez", "ygonzaleznavarro@lewisu.edu", "Goldie#8816");
INSERT INTO members (firstName, lastName, discordName) VALUES("Ryan", "Corrigan", "Ryan#8258");
INSERT INTO members (firstName, lastName, email, discordName) VALUES("Justin", "Ambrosio", "justinmambrosio@lewisu.edu", "Justinnn#2715");

INSERT INTO clothing (clothingType, clothingColor, clothingPrice) VALUES ("camo shortsleeve", "red", 15);
INSERT INTO clothing (clothingType, clothingColor, clothingPrice) VALUES ("camo shortsleeve", "black", 15);
INSERT INTO clothing (clothingType, clothingColor, clothingPrice) VALUES ("hoodie", "red", 30);
INSERT INTO clothing (clothingType, clothingColor, clothingPrice) VALUES ("hoodie", "black", 30);

INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberID FROM members WHERE firstname = "Tyler" AND lastname = "Starkus"), 15);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Leonard" AND lastName = "Lucheck"), 30);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Michael" AND lastName = "Bojarksi"), 15);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Brendan" AND lastName = "Cagampang"), 15);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Yesenia" AND lastName = "Gonzalez"), 30);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Ryan" AND lastName = "Corrigan"), 30);
INSERT INTO dues (memberId, amountPaid) VALUES((SELECT memberId FROM members WHERE firstName = "Justin" AND lastName = "Ambrosio"), 40);

INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberID FROM members WHERE firstname = "Tyler" AND lastName = "Starkus"), (SELECT clothingId FROM clothing WHERE clothingType = "camo shortsleeve" AND clothingColor = "red"), "M");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Leonard" AND lastName = "Lucheck"), (SELECT clothingId FROM clothing WHERE clothingType = "hoodie" AND clothingColor = "black"), "M");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Michael" AND lastName = "Bojarski"), (SELECT clothingId FROM clothing WHERE clothingType = "camo shortsleeve" AND clothingColor = "red"), "S");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Brendan" AND lastName = "Cagampang"), (SELECT clothingId FROM clothing WHERE clothingType = "camo shortsleeve" AND clothingColor = "red"), "S");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Yesenia" AND lastName = "Gonzalez"), (SELECT clothingId FROM clothing WHERE clothingType = "hoodie" AND clothingColor = "black"), "L");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Ryan" AND lastName = "Corrigan"), (SELECT clothingId FROM clothing WHERE clothingType = "hoodie" AND clothingColor = "red"), "M");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Justin" AND lastName = "Ambrosio"), (SELECT clothingId FROM clothing WHERE clothingType = "camo shortsleeve" AND clothingColor = "black"), "M");
INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberId FROM members WHERE firstName = "Justin" AND lastName = "Ambrosio"), (SELECT clothingId FROM clothing WHERE clothingType = "hoodie" AND clothingColor = "black"), "M");