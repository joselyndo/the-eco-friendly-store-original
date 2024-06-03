'use strict';

const express = require('express');
const multer = require("multer");
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

const INVALID_PARAM_ERROR = 400;
const MISSING_PARAM_MSG = "Missing parameters. Please try again.";
const INCORRECT_LOG_IN = "Incorrect username or password. Please try again.";
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = "An error occurred on the server. Try again later.";
const PORT_NUM = 8000;

app.post("/create-account", async function(req, res) {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    res.type("text");

    if (username && email && password) {
      let db = await getDBConnection();
      let query = "SELECT username FROM users WHERE username = ?;";
      let result = await db.get(query, username);
      if (result !== undefined) {
        await db.close();
        res.status(INVALID_PARAM_ERROR).send("Username taken. Please create a different username.");
      } else {
        let addUserQuery = "INSERT INTO users(username, password, email, balance) " +
                            "VALUES(?, ?, ?, 25);";
        await db.run(addUserQuery, [username, password, email]);
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
    res.type("text");

    if (username && password) {
      let db = await getDBConnection();
      let getUserQuery = "SELECT username, password FROM users WHERE username = ?";
      let result = await db.get(getUserQuery, username);
      await db.close();
      if (result === undefined || result.password !== password) {
        res.status(INVALID_PARAM_ERROR).send(INCORRECT_LOG_IN);
      } else {
        res.send("Login successful");
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    }
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/buy/", async function(req, res) {
  let item = req.body["item"]; // To implement: List of items for checkout
  let quantity = req.body["quantity"];

  if (typeof item === 'undefined' || typeof quantity === 'undefined' || quantity <= 0) {
    res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
  }

  try {
    let db = await getDBConnection();
    let exist = await db.get("SELECT id FROM products WHERE item = ?", [item]);
    if (!exist) { // should have await db.close() in this if statement
      return res.status(INVALID_PARAM_ERROR).send("Product does not exist. Please try again"); // return???
    }
    let priceQuery = "SELECT price FROM products WHERE item = ?";
    let price = await db.get(priceQuery, [item]);
    let query = "UPDATE users SET balance = balance - ? WHERE user_id = ?";
    await db.run(query, [price * quantity, USER_ID_PLACEHOLDER]); // Send error if user does not have enough money
    await db.close();
    res.send(quantity + " " + item + "s were successfully purchased.");
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/products/all", async function(req, res) {
  try {
    let db = await getDBConnection();
    let query = "SELECT item, image, price, rating FROM products;";
    let rows = await db.all(query);
    await db.close();
    res.json(rows);
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/products/search", async function(req, res) {
  let searchTerm = req.query["search-term"];
  let productCategory = req.query["product-category"];
  let maxPrice = req.query["max-price"];
  let minRating = req.query["min-rating"];
  let maxRating = req.query["max-rating"];
  try {
    if (searchTerm && productCategory && maxPrice && minRating && maxRating) {
      if (minRating <= maxRating) {
        let query = createSearchFilterQuery(true);
        let filters = [searchTerm, productCategory, maxPrice, minRating, maxRating];
        let results = await searchFilterProducts(query, filters);
        res.json(results);
      } else {
        res.type("text");
        res.status(INVALID_PARAM_ERROR);
        res.send("min-rating must be less than or equal to max-rating.");
      }
    } else if (searchTerm) {
      let query = createSearchFilterQuery(false);
      let results = await searchFilterProducts(query, [searchTerm]);
      res.json(results);
    } else {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    }
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/products/filter", async function(req, res) {
  let productCategory = req.query["product-category"];
  let maxPrice = req.query["max-price"];
  let minRating = req.query["min-rating"];
  let maxRating = req.query["max-rating"];
  try {
    if (productCategory || maxPrice || (minRating && maxRating && (minRating <= maxRating))) {
      let parameters = createFilterQueryWithParams(productCategory, maxPrice, minRating, maxRating);
      let db = await getDBConnection();
      let results = await db.all(parameters[0], parameters[1]);
      await db.close();
      res.json(results);
    } else {
      res.type("text");
      res.status("Missing or invalid parameters. Please try again.").send(MISSING_PARAM_MSG);
    }
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/details/:item", async function(req, res) {
  let item = req.params["item"];

  try {
    let db = await getDBConnection();
    let query = "SELECT item, image, description, price, rating, stock " +
      "FROM products " +
      "WHERE item = ?;";
    let details = await db.get(query, item);
    await db.close();
    if (details) {
      res.json(details);
    } else {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Product not found.");
    }
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/cart", async function(req, res) {
  let items = req.body.cart;
  items = JSON.parse(items);
  if (!items || items.length === 0) {
    return res.status(400).send("Cart is empty");
  }

  try {
    let db = await getDBConnection();
    let result = [];
    for (let i = 0; i < items.length; i++) {
      let item = await db.get("SELECT id FROM products WHERE item = ?", [items[i]]);

      if (!item) { // add in an await db.close here
        res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
      }

      let query = "SELECT item, price, rating, description, image FROM products WHERE id = ?";
      let row = await db.get(query, [item["id"]]);

      result.push(row);
    }
    await db.close();
    res.send(result);

  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/best-sellers", async function(req, res) {
  let orderBy = "rating";
  const limit = 5;

  try {
    let db = await getDBConnection();
    let query = "SELECT item, image, price, rating " +
      "FROM products " +
      "ORDER BY " + orderBy + " DESC " +
      "LIMIT " + limit + ";";
    let result = await db.all(query);
    await db.close();
    res.send(result);
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.post("/feedback", async function(req, res) {
  let item = req.body.item;
  let username = req.body.username;
  let rating = req.body.rating;
  let review = req.body.review;
  res.type("text");

  try {
    if (!(item && username && rating && review)) {
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    } else {
      let db = await getDBConnection();
      let query = "INSERT INTO reviews(item, username, review, rating) " +
        "VALUES(?, ?, ?, ?);";
      await db.run(query, [item, username, review, rating]);
      await db.close();
      res.send("Review successfully submitted.");
    }
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

app.get("/reviews/:item", async function(req, res) {
  let itemName = req.params["item"];
  try {
    let db = await getDBConnection();
    let hasItem = await db.get("SELECT item FROM products WHERE item = ?;", itemName);
    if (hasItem === undefined) {
      await db.close();
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send(MISSING_PARAM_MSG);
    } else {
      let query = "SELECT r.username, r.review, r.rating, r.date " +
        "FROM reviews AS r, products AS p " +
        "WHERE p.item = ? " +
        "AND p.item = r.item " +
        "ORDER BY datetime(r.date) DESC;";
      let results = await db.all(query, itemName);
      await db.close();
      res.json(results);
    }
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Returns a string representing a query based on the given information
 * @param {Boolean} useFilter - a Boolean representing whether the optional filters are being used
 * @returns {String} - a string representing a search query
 */
function createSearchFilterQuery(useFilter) {
  let query = "SELECT item, image, price, rating FROM products WHERE";
  if (useFilter) {
    query += " ((item LIKE ?) OR (description LIKE ?) OR (category LIKE ?))";
    query += " AND category = ?";
    query += " AND price < ?";
    query += " AND rating BETWEEN ? AND ?;";
  } else {
    query += " (item LIKE ?) OR (description LIKE ?) OR (category LIKE ?);";
  }

  return query;
}

/**
 * Creates a query with the required parameters for that query
 * @param {String} productCategory - the desired category of products
 * @param {Number} maxPrice - the desired max price of products
 * @param {Number} minRating - the desired minimum rating of products
 * @param {Number} maxRating - the desired maximum rating of products
 * @returns {Object[]} - returns a string query and an array of parameters for that query
 */
function createFilterQueryWithParams(productCategory, maxPrice, minRating, maxRating) {
  let filter = "";
  let requiredParameters = [];

  if (productCategory) {
    filter += " category = ?";
    requiredParameters.push(productCategory);
  }

  if (maxPrice) {
    filter = addAndKeyword(filter);
    filter += " price < ?";
    requiredParameters.push(maxPrice);
  }

  if (minRating && maxRating) {
    filter = addAndKeyword(filter);
    filter += " rating BETWEEN ? AND ?";
    requiredParameters.push(minRating);
    requiredParameters.push(maxRating);
  }

  filter += ";";
  let query = "SELECT item, image, price, rating FROM products WHERE";
  return [query + filter, requiredParameters];
}

/**
 * Adds "AND" to the given string if it is not empty
 * @param {String} string - the string to add "AND" to
 * @returns {String} - the string that may or may not have "AND" added to
 */
function addAndKeyword(string) {
  let returnedString = string;
  if (returnedString !== "") {
    returnedString += " AND";
  }

  return returnedString;
}

/**
 * Queries for the products matching the given filters
 * @param {String} query - the query to use
 * @param {String[]} filters - an array of the filters that a product must meet
 * @returns {JSON[]} - the results of the filtered search
 */
async function searchFilterProducts(query, filters) {
  let searchTerm = filters[0];
  let queryTerm = "%" + searchTerm + "%";
  let placeholderParams = [queryTerm, queryTerm, queryTerm];
  let results = undefined;
  let db = await getDBConnection();
  if (filters.length === 1) {
    results = await db.all(query, placeholderParams);
  } else {
    for (let param = 1; param < filters.length; param++) {
      placeholderParams.push(filters[param]);
    }

    results = await db.all(query, placeholderParams);
  }

  await db.close();
  return results;
}

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
