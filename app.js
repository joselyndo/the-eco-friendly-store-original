'use strict';

const express = require('express');
const multer = require("multer");
const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module
app.use(express.static('public'));


const PORT = process.env.PORT || 8000;
app.listen(PORT);