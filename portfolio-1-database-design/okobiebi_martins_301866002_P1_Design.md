# Library Management System — database design

My case study records readers, books, loans.

## Users

- Library staff managing readers and book records
- Readers borrowing and returning books

## Main operations

- Register readers and lendable book copies
- Check out and return book copies
- Find overdue loans and summarize lending activity

## Entities

| Entity | Information stored |
| --- | --- |
| readers | People who may borrow book copies. |
| books | Lendable book copies available to readers. |
| loans | Checkout and return records linking one reader to one book copy. |

## readers

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| reader_id | BIGINT | PK | Yes |
| name | TEXT |  | Yes |
| email | TEXT | Unique | Yes |
| joined_on | DATE |  | Yes |
- Unique key: (email).

## books

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| book_id | BIGINT | PK | Yes |
| isbn | TEXT | Unique | Yes |
| title | TEXT |  | Yes |
| author | TEXT |  | Yes |
| published_year | INTEGER |  | No |
- Unique key: (isbn).

## loans

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| loan_id | BIGINT | PK | Yes |
| reader_id | BIGINT | FK | Yes |
| book_id | BIGINT | FK | Yes |
| checkout_date | DATE |  | Yes |
| due_date | DATE |  | Yes |
| returned_date | DATE |  | No |
- reader_id → readers.reader_id
- book_id → books.book_id

## Relationships and business rules

- Each reader email identifies at most one reader.
- Each ISBN identifies at most one lendable copy in this exercise.
- Each loan references an existing reader through reader_id.
- Each loan references an existing book copy through book_id.
- A loan due date must be on or after its checkout date.
- A book copy can have at most one loan whose returned_date is null.

## Assumptions

- Each Books row represents one lendable copy, and each ISBN identifies at most one copy in this exercise.
- A loan is active when returned_date is null; a book copy may have at most one active loan.
- All entity primary-key values come from one shared identifier namespace, so IDs are globally unique across tables.
- Dates use a consistent calendar and due_date cannot precede checkout_date.
- All example records and benchmark rows are synthetic.

