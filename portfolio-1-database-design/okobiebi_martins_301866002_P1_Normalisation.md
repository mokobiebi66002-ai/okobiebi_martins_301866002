# Library Management System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| reader_id | loans records (list) |
| --- | --- |
| 101 | [301] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| loans.loan_id | loans.reader_id | loans.book_id | readers.reader_id | readers.name | books.book_id | books.isbn |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 101 | Avery Chen | 201 | 9780000000001 |

Key: loan_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## loans_example

| loans.loan_id | loans.reader_id | loans.book_id | readers.reader_id | readers.name | books.book_id | books.isbn |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 101 | Avery Chen | 201 | 9780000000001 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## readers

| reader_id | name | email | joined_on |
| --- | --- | --- | --- |
| 101 | Avery Chen | avery.chen@example.test | 2025-01-10 |
| 102 | Jordan Patel | jordan.patel@example.test | 2025-02-14 |

## books

| book_id | isbn | title | author | published_year |
| --- | --- | --- | --- | --- |
| 201 | 9780000000001 | The Quiet Harbor | Morgan Lee | 2020 |
| 202 | 9780000000002 | Maps of the Orchard | Casey Rivera | 2018 |

## loans

| loan_id | reader_id | book_id | checkout_date | due_date | returned_date |
| --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2025-10-01 | 2025-10-15 | NULL |

## Dependencies

- readers: (reader_id) → name, email, joined_on
- books: (book_id) → isbn, title, author, published_year
- loans: (loan_id) → reader_id, book_id, checkout_date, due_date, returned_date

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
