-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. reject readers pk. Expected: pk_readers, SQLSTATE 23505.
INSERT INTO portfolio."readers" ("reader_id", "name", "email", "joined_on")
VALUES (101, 'Taylor Kim', 'taylor.kim@example.test', '2025-03-01');

-- 2. reject readers email. Expected: uq_readers_0, SQLSTATE 23505.
INSERT INTO portfolio."readers" ("reader_id", "name", "email", "joined_on")
VALUES (1001, 'Taylor Kim', 'avery.chen@example.test', '2025-03-01');

-- 3. reject readers name null. Expected: name, SQLSTATE 23502.
INSERT INTO portfolio."readers" ("reader_id", "name", "email", "joined_on")
VALUES (1002, NULL, 'taylor.kim@example.test', '2025-03-01');

-- 4. reject books pk. Expected: pk_books, SQLSTATE 23505.
INSERT INTO portfolio."books" ("book_id", "isbn", "title", "author", "published_year")
VALUES (201, '9780000000003', 'A Different Shore', 'Riley Park', 2021);

-- 5. reject books isbn. Expected: uq_books_0, SQLSTATE 23505.
INSERT INTO portfolio."books" ("book_id", "isbn", "title", "author", "published_year")
VALUES (1003, '9780000000001', 'A Different Shore', 'Riley Park', 2021);

-- 6. reject loans pk. Expected: pk_loans, SQLSTATE 23505.
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date")
VALUES (301, 102, 202, '2025-11-01', '2025-11-15', '2025-11-10');

-- 7. reject loans reader fk. Expected: fk_loans_0, SQLSTATE 23503.
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date")
VALUES (1005, 90001, 202, '2025-11-01', '2025-11-15', NULL);

-- 8. reject loans book fk. Expected: fk_loans_1, SQLSTATE 23503.
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date")
VALUES (1006, 102, 90002, '2025-11-01', '2025-11-15', NULL);

-- 9. reject loans dates. Expected: loan_dates_ordered, SQLSTATE 23514.
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date")
VALUES (1007, 102, 202, '2025-11-15', '2025-11-01', '2025-11-15');

-- 10. reject loans active book. Expected: active_book_loan, SQLSTATE 23505.
INSERT INTO portfolio."loans" ("loan_id", "reader_id", "book_id", "checkout_date", "due_date", "returned_date")
VALUES (1008, 102, 201, '2025-11-01', '2025-11-15', NULL);
