# Library Management System — SQL queries

## 1. Show related loans, readers, books records (up to 20).

```sql
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
```

| loans_loan_id | loans_checkout_date | readers_reader_id | readers_name | books_book_id | books_isbn |
| --- | --- | --- | --- | --- | --- |
| 301 | 2025-10-01 | 101 | Avery Chen | 201 | 9780000000001 |

## 2. Find loans records where due_date matches "2025-10-15" (up to 20).

```sql
SELECT * FROM portfolio."loans"
WHERE "due_date" IS NOT DISTINCT FROM '2025-10-15'
ORDER BY "loan_id"
LIMIT 20;
```

| loan_id | reader_id | book_id | checkout_date | due_date | returned_date |
| --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2025-10-01 | 2025-10-15 | NULL |

## 3. Count loans records for each reader_id (up to 20 groups).

```sql
SELECT "reader_id", count(*) AS record_count
FROM portfolio."loans"
GROUP BY "reader_id"
ORDER BY record_count DESC, "reader_id" NULLS LAST
LIMIT 20;
```

| reader_id | record_count |
| --- | --- |
| 101 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 0.933 | 0.933, 1.938, 0.931 | Sort → Seq Scan | 112 |
| After index | 0.169 | 0.161, 0.172, 0.169 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 0.933 ms to 0.169 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=0.903..0.905 rows=20 loops=1)
  Seq Scan on loans (actual time=0.013..0.87 rows=20 loops=1)
Planning Time: 0.347 ms
Execution Time: 0.933 ms
```

### Before index, run 2

```text
Sort (actual time=1.89..1.892 rows=20 loops=1)
  Seq Scan on loans (actual time=0.021..1.837 rows=20 loops=1)
Planning Time: 0.476 ms
Execution Time: 1.938 ms
```

### Before index, run 3

```text
Sort (actual time=0.9..0.902 rows=20 loops=1)
  Seq Scan on loans (actual time=0.013..0.866 rows=20 loops=1)
Planning Time: 0.333 ms
Execution Time: 0.931 ms
```

### After index, run 1

```text
Sort (actual time=0.116..0.118 rows=20 loops=1)
  Bitmap Heap Scan on loans (actual time=0.023..0.083 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.012..0.012 rows=20 loops=1)
Planning Time: 0.526 ms
Execution Time: 0.161 ms
```

### After index, run 2

```text
Sort (actual time=0.122..0.124 rows=20 loops=1)
  Bitmap Heap Scan on loans (actual time=0.023..0.088 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.012..0.012 rows=20 loops=1)
Planning Time: 0.563 ms
Execution Time: 0.172 ms
```

### After index, run 3

```text
Sort (actual time=0.124..0.125 rows=20 loops=1)
  Bitmap Heap Scan on loans (actual time=0.024..0.089 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.012..0.012 rows=20 loops=1)
Planning Time: 0.534 ms
Execution Time: 0.169 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run okobiebi_martins_301866002_P2_Queries.sql, then okobiebi_martins_301866002_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/okobiebi_martins_301866002_P2_QueryResults.png) · [Index comparison](screenshots/okobiebi_martins_301866002_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

