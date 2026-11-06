-- Show related loans, readers, books records (up to 20).
SELECT t0."loan_id" AS "loans_loan_id",
       t0."checkout_date" AS "loans_checkout_date",
       t1."reader_id" AS "readers_reader_id",
       t1."name" AS "readers_name",
       t2."book_id" AS "books_book_id",
       t2."isbn" AS "books_isbn"
FROM portfolio."loans" t0
JOIN portfolio."readers" t1 ON t0."reader_id" = t1."reader_id"
JOIN portfolio."books" t2 ON t0."book_id" = t2."book_id"
ORDER BY t0."loan_id", t1."reader_id", t2."book_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."loan_id" AS "loans_loan_id",
       t0."checkout_date" AS "loans_checkout_date",
       t1."reader_id" AS "readers_reader_id",
       t1."name" AS "readers_name",
       t2."book_id" AS "books_book_id",
       t2."isbn" AS "books_isbn"
FROM portfolio."loans" t0
JOIN portfolio."readers" t1 ON t0."reader_id" = t1."reader_id"
JOIN portfolio."books" t2 ON t0."book_id" = t2."book_id"
ORDER BY t0."loan_id", t1."reader_id", t2."book_id"
LIMIT 20;

-- Find loans records where due_date matches "2025-10-15" (up to 20).
SELECT * FROM portfolio."loans"
WHERE "due_date" IS NOT DISTINCT FROM '2025-10-15'
ORDER BY "loan_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."loans"
WHERE "due_date" IS NOT DISTINCT FROM '2025-10-15'
ORDER BY "loan_id"
LIMIT 20;

-- Count loans records for each reader_id (up to 20 groups).
SELECT "reader_id", count(*) AS record_count
FROM portfolio."loans"
GROUP BY "reader_id"
ORDER BY record_count DESC, "reader_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "reader_id", count(*) AS record_count
FROM portfolio."loans"
GROUP BY "reader_id"
ORDER BY record_count DESC, "reader_id" NULLS LAST
LIMIT 20;
