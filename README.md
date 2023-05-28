# Practica Avanzada-Api-Node.js-MongoDB. 






[Random images module](https://www.npmjs.com/package/practica-random) Bonus Track. npm Module to get Random images


## Deploy

### Install dependencies

    npm install

### Configure

Review lib/connectMongoose.js to set database configuration

### Init database

    npm run initDB

## Start

To start a single instance:

    npm start

To start in development mode:

    npm run dev (including nodemon & debug log)

To start Core Server:

    npm run cote
## Test

    npm test 

## ESLint

    npm run hints

## API v1 info

### Base Path

The API can be used with the path:
[API V1](/apiv1/anuncios)

### Error example

    {
      "error": {
        "code": 401,
        "message": "This is the error message."
      }
    }

### GET /anuncios

**Input Query**:

start: {int} skip records
limit: {int} limit to records
sort: {string} field name to sort by
includeTotal: {bool} whether to include the count of total records without filters
tag: {string} tag name to filter
venta: {bool} filter by venta or not
precio: {range} filter by price range, examples 10-90, -90, 10-
nombre: {string} filter names beginning with the string

Input query example: ?start=0&limit=2&sort=precio&includeTotal=true&tag=mobile&venta=true&precio=-90&nombre=bi

**Result:**

    {
      "result": {
        "rows": [
          {
            "_id": "55fd9abda8cd1d9a240c8230",
            "nombre": "iPhone 3GS",
            "venta": false,
            "precio": 50,
            "foto": "/images/anuncios/iphone.png",
            "__v": 0,
            "tags": [
              "lifestyle",
              "mobile"
            ]
          }
        ],
        "total": 1
      }
    }

### GET /anuncios/tags

Return the list of available tags for the resource anuncios.

**Result:**

    {
      "result": [
        "work",
        "lifestyle",
        "motor",
        "mobile"
      ]
    }

