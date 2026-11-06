-- Fictional sample records for Library Management System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."readers" ("reader_id", "name", "email", "joined_on") VALUES (101, 'Avery Chen', 'avery.chen@example.test', '2025-01-10');
INSERT INTO portfolio."readers" ("reader_id", "name", "email", "joined_on") VALUES (102, 'Jordan Patel', 'jordan.patel@example.test', '2025-02-14');
INSERT INTO portfolio."books" ("book_id", "isbn", "title", "author", "published_year") VALUES (201, '9780000000001', 'The Quiet Harbor', 'Morgan Lee', 2020);
INSERT INTO portfolio."books" ("book_id", "isbn", "title", "author", "published_year") VALUES (202, '9780000000002', 'Maps of the Orchard', 'Casey Rivera', 2018);
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date") VALUES (301, 101, 201, '2025-10-01', '2025-10-15', NULL);
COMMIT;
