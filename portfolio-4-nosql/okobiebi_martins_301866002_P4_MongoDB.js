// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("loan_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("loan_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "loan_created",
                    "loan_returned"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "loans"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "loan_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("loan_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "loan_returned",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "return_condition": "illustrative return_condition",
                "client_metadata": "illustrative client_metadata"
            }
        }
    }
]));
  await db.getCollection("loan_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("loan_events").find({"eventType":"loan_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("loan_events").find({"source.key.loan_id":301}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("loan_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("loan_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("loan_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("loan_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("loan_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
