
# API Documentation

## Overview

This API provides CRUD (Create, Read, Update, Delete) operations for interacting with a PostgreSQL database. It allows you to perform operations on tables based on the specified table name.

## Base URL

The base URL for this API is `http://4.228.225.15:3000`.

## Endpoints

### GET /api/:tableName

Retrieve data from a specified table.

#### Parameters

- `tableName` (required): The name of the table from which to retrieve data.

#### Query Parameters

You can include query parameters to filter the results. The query parameters should correspond to column names in the specified table.

Refer to the database structure to see the possible query parameters.

#### Response

- Status Code: 200 OK
- Body: An array of objects representing the rows retrieved from the table.

#### Errors

- 404 Not Found: If the specified table does not exist.
- 400 Bad Request: If invalid query parameters are provided.

### POST /api/:tableName

Insert new data into a specified table.

#### Parameters

- `tableName` (required): The name of the table in which to insert data.

#### Request Body

Provide a JSON object representing the data to be inserted. The keys of the object should correspond to column names in the specified table.

#### Response

- Status Code: 201 Created
- Body: None

#### Errors

- 404 Not Found: If the specified table does not exist.
- 400 Bad Request: If the request body is missing or contains invalid data.

### PATCH /api/:tableName/:id

Update data in a specified table by ID.

#### Parameters

- `tableName` (required): The name of the table in which to update data.
- `id` (required): The ID of the row to be updated.

#### Request Body

Provide a JSON object representing the data to be updated. The keys of the object should correspond to column names in the specified table.

#### Response

- Status Code: 200 OK
- Body: None

#### Errors

- 404 Not Found: If the specified table does not exist.
- 400 Bad Request: If the request body is missing or contains invalid data.

### DELETE /api/:tableName/:id

Delete data from a specified table by ID.

#### Parameters

- `tableName` (required): The name of the table from which to delete data.
- `id` (required): The ID of the row to be deleted.

#### Response

- Status Code: 200 OK
- Body: None

#### Errors

- 404 Not Found: If the specified table does not exist.

## Examples

### GET /api/user?username=John&birthdate=2001-02-12

Retrieve users with the username "John" and birthday "02/12/2001".

### POST /api/user

Insert a new user into the "users" table.

Request Body:
```json
{
  "username": "Alice",
  "password": "123456789",
  "registrationdate": "2024-08-18",
  "birthdate": "1999-06-11"
}
```

### Database structure

#### user
| Column Name   | Data Type                 | Nullable | Constraint   |
|---------------|----------------------------|----------|--------------|
| id            | integer                    | Identity       | PRIMARY KEY  |
| username      | character varying(50)      | No       |              |
| registrationdate | date                     | No       |              |
| birthdate     | date                       | No       |              |
| profilepic    | text                       | Yes      |              |
| description   | character varying(200)     | Yes      |              |
| password      | character varying(50)      | No       |              |

#### game
| Column Name      | Data Type                    | Nullable | Constraint                |
|------------------|-------------------------------|----------|---------------------------|
| id               | integer                       | Identity       | PRIMARY KEY               |
| title            | text                          | No       |                           |
| releasedate      | timestamp without time zone  | No       |                           |
| insertiondate    | date                          | No       |                           |
| developerid      | integer                       | No       | FOREIGN KEY  |
| file             | text                          | No       |                           |
| shortdescription | character varying(200)        | No       |                           |
| longdescription  | character varying(1000)       | No       |                           |
| gamerequirements | text                          | No       |                           |
| media            | text                          | No       |                           |


#### developer
| Column Name    | Data Type                  | Nullable | Constraint   |
|----------------|-----------------------------|----------|--------------|
| developerid    | integer                     | Identity | PRIMARY KEY  |
| developername  | character varying(100)      | No       |              |
| registrationdate | date                       | No       |              |
| profilepic     | text                        | Yes      |              |
| description    | character varying(200)      | No       |              |

 
#### category
| Column Name   | Data Type                 | Nullable | Constraint   |
|---------------|----------------------------|----------|--------------|
| id            | integer                    | Identity | PRIMARY KEY  |
| name          | character varying(50)      | No       |              |
| description   | text                       | No       |              |

#### gamecategory
| Column Name   | Data Type  | Nullable | Constraint                |
|---------------|------------|----------|---------------------------|
| id            | integer    | Identity       | PRIMARY KEY               |
| gameid        | integer    | No       | FOREIGN KEY |
| categoryid    | integer    | No       | FOREIGN KEY |

#### review
| Column Name   | Data Type | Nullable | Constraint                |
|---------------|-----------|----------|---------------------------|
| id            | integer   | Identity       | PRIMARY KEY               |
| userid        | integer   | No       | FOREIGN KEY |
| gameid        | integer   | No       | FOREIGN KEY |
| rating        | integer   | No       |                           |
| comment       | text      | Yes      |                           |

#### usergame

| Column Name   | Data Type                  | Nullable | Constraint                |
|---------------|----------------------------|----------|---------------------------|
| id            | integer                    | No       | PRIMARY KEY               |
| userid        | integer                    | No       | FOREIGN KEY |
| gameid        | integer                    | No       | FOREIGN KEY |
| purchasedate  | timestamp without time zone| No       |                           |
| writedate     | date                       | No       |                           |









