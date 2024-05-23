'use strict';

const express = require('express');
const multer = require("multer");
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = "An error occurred on the server. Try again later.";
const PORT_NUM = 8000

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'yipper.db',
    driver: sqlite3.Database
  });

  return db;
}

// tells the code to serve static files in a directory called 'public'
app.use(express.static('public'));

// specify the port to listen on
const PORT = process.env.PORT || PORT_NUM;

// tells the application to run on the specified port
app.listen(PORT);
