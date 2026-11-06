-- Library Management System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."readers" (
  "reader_id" bigint NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "joined_on" date NOT NULL,
  CONSTRAINT "pk_readers" PRIMARY KEY ("reader_id"),
  CONSTRAINT "uq_readers_0" UNIQUE ("email")
);
CREATE TABLE portfolio."books" (
  "book_id" bigint NOT NULL,
  "isbn" text NOT NULL,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "published_year" bigint,
  CONSTRAINT "pk_books" PRIMARY KEY ("book_id"),
  CONSTRAINT "uq_books_0" UNIQUE ("isbn")
);
CREATE TABLE portfolio."loans" (
  "loan_id" bigint NOT NULL,
  "reader_id" bigint NOT NULL,
  "book_id" bigint NOT NULL,
  "checkout_date" date NOT NULL,
  "due_date" date NOT NULL,
  "returned_date" date,
  CONSTRAINT "pk_loans" PRIMARY KEY ("loan_id")
);
ALTER TABLE portfolio."loans" ADD CONSTRAINT "fk_loans_0" FOREIGN KEY ("reader_id") REFERENCES portfolio."readers" ("reader_id");
ALTER TABLE portfolio."loans" ADD CONSTRAINT "fk_loans_1" FOREIGN KEY ("book_id") REFERENCES portfolio."books" ("book_id");
ALTER TABLE portfolio."loans" ADD CONSTRAINT "loan_dates_ordered" CHECK ("due_date" > "checkout_date");
CREATE UNIQUE INDEX "active_book_loan" ON portfolio."loans" ("book_id") WHERE ("returned_date" IS NULL);
COMMIT;
