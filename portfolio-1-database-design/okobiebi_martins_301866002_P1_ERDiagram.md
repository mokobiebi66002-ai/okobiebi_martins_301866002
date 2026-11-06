# Library Management System — ER diagram

```mermaid
erDiagram
    direction LR
    readers {
        bigint reader_id PK
        text name
        text email UK
        date joined_on
    }
    books {
        bigint book_id PK
        text isbn UK
        text title
        text author
        integer published_year "Optional"
    }
    loans {
        bigint loan_id PK
        bigint reader_id FK
        bigint book_id FK
        date checkout_date
        date due_date
        date returned_date "Optional"
    }
    readers ||--o{ loans : "reader_id"
    books ||--o{ loans : "book_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/okobiebi_martins_301866002_ERDiagram.png)
