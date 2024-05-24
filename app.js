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
const MISSING_PARAM_MSG = "Missing parameters. Please try again.";
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = "An error occurred on the server. Try again later.";
const PORT_NUM = 8000

app.post("/create-account", async function(req, res) {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    res.type("text");

    if (username && email && password) {
      let db = await getDBConnection();
      let result = db.get("SELECT username FROM store;");
      if (result === undefined) {
        await db.close();
        res.status(INVALID_PARAM_ERROR).send("Username taken. Please create a new username.");
      } else {
        let addUserQuery = "INSERT INTO users(username, password, email, created_date) " +
                            "VALUES(?, ?, ?, DATE('now'));";
        db.run(addUserQuery, [username, email, password]);
        await db.close();
        res.send("Account successfully created.");
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    }
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/log-in", async function(req, res) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    res.type("type");

    if (username && password) {
      let db = await getDBConnection();
      let getUserQuery = "SELECT username, password FROM users WHERE username = ?";
      let result = await db.get(getUserQuery, [username]);
      await db.close();
      if (result === undefined) {
        res.status(INVALID_PARAM_ERROR).send("Incorrect username or password. Please try again.");
      } else {
        if (result.password === password) {
          // TODO: set cookie for login_status
          res.send("Login successful");
        } else {
          res.status(INVALID_PARAM_ERROR).send("Incorrect username or password. Please try again.");
        }
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    }
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/buy/", async function (req, res) {
  let item = req.body["item"]; // To implement: List of items for checkout
  let quantity = req.body["quantity"];

  if (typeof item === 'undefined' || typeof quantity === 'undefined' || quantity <= 0) {
    res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
  }

  try {
    let db = await getDBConnection();

    let exist = await db.get("SELECT id FROM products WHERE item = ?", [item]);
    if (!exist) {
      return res.status(INVALID_PARAM_ERROR).send("Product does not exist. Please try again");
    }
    let priceQuery = "SELECT price FROM products WHERE item = ?";
    let price = await db.get(priceQuery, [item]);
    let query = "UPDATE users SET balance = balance - ? WHERE user_id = ?";
    await db.run(query, [price * quantity, USER_ID_PLACEHOLDER]); // Send error if user does not have enough money
    await db.close();
    res.send(quantity + " "  + item + "s were successfully purchased.");
  } catch {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/addToCart", async function (req, res) {
  let item = req.body["item"];
  let quantity = req.body["quantity"];

  if (typeof item === 'undefined' || typeof quantity === 'undefined' || quantity <= 0) {
    res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
  }

  try {
    let db = await getDBConnection();

    let exist = await db.get("SELECT id FROM products WHERE item = ?", [item]);
    if (!exist) {
      return res.status(INVALID_PARAM_ERROR).send("Product does not exist. Please try again");
    }
    let query = "UPDATE users SET cart = ? WHERE user_id = ?";
    let toAdd = {item: quantity};
    await db.run(query, [toAdd, USER_ID_PLACEHOLDER]); // Send error if user does not have enough money
    await db.close();
    res.send(quantity + " "  + item + "s were successfully added to your cart.");
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/products", async function(req, res) {
  let productName = req.query["product-name"];
  let productPrice = req.query.price;
  let productType = req.query["product-type"];
  let productRating = req.query.rating;
  try {
    if (!(productName && productPrice && productType && productRating)) { // No query parameters are set
      let genSearchQuery = "SELECT name, price, rating, stock FROM products;" // TODO: add image column
      let db = await getDBConnection();
      let results = await db.all(genSearchQuery); // send results or format it?
    } else {
      // Handle the case where only one to all query parameters are set
    }
  } catch (error) {
    res.type("type");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/detail/:item", async function (req, res) {
  let item = req.param["item"];

  try {
    let db = await getDBConnection();
    let rating = await db.get("SELECT rating FROM products WHERE item = ?", [item]);
    let description = await db.get("SELECT description FROM products WHERE item = ?", [item]);
    let reviews = await db.get("SELECT reviews FROM products WHERE item = ?", [item]);
    res.send({
      "item": item,
      "rating": rating,
      "description": description,
      "reviews": reviews
    })
  } catch {
    res.type("type");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/cart", async function (req, res) {
  try {
    let db = await getDBConnection();
    let query = "SELECT cart FROM users WHERE user_id = ?";
    let result = await db.get(query, [USER_ID_PLACEHOLDER]);
    res.send(result);
  } catch (error) {
    res.type("type");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/best-sellers", async function (req, res) {
  let orderBy = "rating"; // Default filter is rating for now
  let limit = 5; // Default 5 products

  try {
    let db = await getDBConnection();
    let query = "SELECT items FROM products ORDER BY ? LIMIT ?";
    let result = await db.all(query, [orderBy, limit]);
    res.send(result);
  } catch (error) {
    res.type("type");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/feedback", async function (req, res) {
  let username = req.body.username;
  let rating = req.body.rating;
  let review = req.body.review;
  let date = req.body.date;

  if (!(username && rating && review && date)) {
    res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
  }

  try {
    let db = await getDBConnection();
    let query = "UPDATE users SET reviews = ? WHERE user_id = ?";
    await db.run(query, [REVIEW_PLACEHOLDER, USER_ID_PLACEHOLDER]);
    res.send("Review successfully submitted");
  } catch (error) {
    res.type("type");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'store.db',
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
