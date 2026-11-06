# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection loan_events for loan_created and loan_returned events. These are fictional event examples based on loans, readers, books.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related readers, books details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "loan_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "loans",
        "key": {
            "loan_id": 301
        },
        "snapshot": {
            "loan_id": 301,
            "reader_id": 101,
            "book_id": 201,
            "checkout_date": "2025-10-01",
            "due_date": "2025-10-15",
            "returned_date": null
        }
    },
    "embedded": {
        "readers": [
            {
                "key": {
                    "reader_id": 101
                },
                "snapshot": {
                    "reader_id": 101,
                    "name": "Avery Chen",
                    "email": "avery.chen@example.test",
                    "joined_on": "2025-01-10"
                },
                "via": [
                    "loans.reader_id → readers"
                ]
            }
        ],
        "books": [
            {
                "key": {
                    "book_id": 201
                },
                "snapshot": {
                    "book_id": 201,
                    "isbn": "9780000000001",
                    "title": "The Quiet Harbor",
                    "author": "Morgan Lee",
                    "published_year": 2020
                },
                "via": [
                    "loans.book_id → books"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 1 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 2 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("loan_events").find({"eventType":"loan_created"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "loan_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 301
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("loan_events").find({"source.key.loan_id":301}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "loan_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "loan_returned",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "loan_id": 301
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("loan_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "loan_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "loan_returned",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "loan_id": 301
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("loan_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| loan_created | 1 |
| loan_returned | 1 |

## Validation and suitability

MongoDB inserted 2 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 2 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run okobiebi_martins_301866002_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/okobiebi_martins_301866002_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

