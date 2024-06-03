# ECommerce Store API Documentation
*This API allows developers to interact with our ecommerce platform by handling
key functionalities such as account management, processing sales, and storing
important user data.*

## Create account
**Request Format:** /create-account

**Request Type:** POST
**Parameters:** "username" (String), "email" (String), "password" (String)

**Returned Data Format**: Plain Text

**Description:** Creates a new user account if the provided username and email are unique

**Example Request:**

POST request: /create-account,
{
    "username": "user1",
    "email": "user1@email.com",
    "password": "pass1"
}

**Example Response:**

```
"Account successfully created."
```

**Error Handling:**
- 400 Bad Request Error:
    - If any of the three parameters (username, email, password) are not given, returns error with response: "Missing parameters. Please try again."
    - If there is already a user with the given username, returns an error with response: "There is already a user with the username [inputted username]. Please create a different username."
    - If there is already a user with the given email, returns an error with response: "There is already a user with the email [inputted email]. Please use a different email address."

- 500 Internal Server Error:
    - If an error occurred on the server, returns an error with the response: “An error occurred during account creation. Please try again later.”

## Log into account
**Request Format:** /log-in

**Request Type:** POST
**Parameters:** "username" (String), "password" (String)

**Returned Data Format**: Plain Text

**Description:** Logs the user in upon successful verification

**Example Request:**

POST request: /log-in
{
    "username": "user1",
    "password": "pass1"
}

**Example Response:**

```
“Login successful.”
```

**Error Handling:**
- 400 Bad Request Error:
    - If either of the parameters (username, password) are not given, returns an error with response: "Missing parameters. Please try again."
    - If the password does not match the actual password for the given username, returns an error with response: "Incorrect username or password. Please try again."

- 500 Internal Server Error:
    - If an error occurred on the server, returns an error with the response: "An error occurred during account login. Please try again later."

## *Buy item*
**Request Format:** /buy

**Request Type:** POST
**Parameters:** "item" (String), "quantity" (int)

**Returned Data Format**: Plain Text

**Description:** Processes a buy order from the user

**Example Request:**

POST request: /buy
{
    "item": "paper straw",
    "quantity": 5
}

**Example Response:**

```
"5 paper straws were successfully purchased."
```

**Error Handling:**
- 400 Bad Request Error:
    - If the product does not exist within the database, returns an error with response: "Product does not exist. Please try again."
    - If the quantity exceeds stock, returns an error with response: "Not enough items in stock. Please try again."

- 500 Internal Server Error:
    - If an error occured on the server, returns an error with the response: "An error occured during the buy process. Please try again
    later."


## Retrieve cart
**Request Format:** /cart

**Request Type:** POST
**Parameters:** "cart" (String)

**Returned Data Format**: JSON

**Description:** Retrieves the user's shopping cart

**Example Request:**

POST request: /cart
"{cart: ["item1", "item2"]}"

**Example Response:**

```
[
  {
    "item": "item1",
    "rating": 4.5,
    "price": 1.00,
    "description": "Description 1",
    "image": "image1.png"
  },
  {
    "item": "item2",
    "rating": 4.0,
    "price": 9.99,
    "description": "Description 2",
    "image": "image2.png"
  }
]

```

**Error Handling:**
- 400 Bad Request Error:
    - If the product does not exist within the database, returns an error with the response: "Invalid parameters. Please try again."
- 500 Internal Server Error:
    - If an error occured on the server, returns an error with the response: "An error occured when attempting to retrieve the cart. Please try again later."

## Search products
**Request Format:** /products/search?item

**Request Type:** GET
**Query:** "item", "type", "price-filter"

**Returned Data Format**: Plain text

**Description:** Retrieves all products

**Example Request:** /products/

**Example Response:**

```
[
    {"item": "Compostable trash bags"}
    {"item": "Reusable metal straws"}
    {"item": "Paper straws"}
    {"item": "Recycled notebook"}
    {"item": "Reusable shopping bag"}
    {"item": "Reusable tote bag"}
    {"item": "Stainless steel water bottle"}
]
```

**Error Handling:**
- 500 Internal Server Error:
    - If an error occurred on the server, returns an error with the response: "An error occurred during product retrieval. Please try again later."

## Search products
**Request Format:** /products/search?item

**Request Type:** GET
**Query:** "item", "type", "price-filter"

**Returned Data Format**: Plain text

**Description:** Retrieves products with a specified product name and/or filters

**Example Request 2:** /products?name=reusable

**Example Response 2:**

```
Reusable metal straws
Reusable shopping bag
Reusable tote bag
```

**Example Request 3:** /products?name=reusable&type=bag

**Example Response 3:**

```
Reusable shopping bag
Reusable tote bag
```

**Example Request 4:** /products?name=alsefmlaskngs&type=akjsdfasljkdfhl

**Example Response 4:**

```
"There are no results for the given query."
```

**Error Handling:**
- 500 Internal Server Error:
    - If an error occurred on the server, returns an error with the response: "An error occurred during product search. Please try again later."

## Get best sellers
**Request Format:** /best-sellers/

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves products with the highest rating / popularity

**Example Request:** /best-sellers/

**Example Response:**

```
[
    {"item": "Compostable trash bags", "rating": 5.0},
    {"item": "Reusable metal straws", "rating": 4.9},
    {"item": "Paper straws", "rating": 4.8},
    {"item": "Recycled notebook", "rating": 4.6},
    {"item": "Reusable shopping bag", "rating": 4.6},

]
```

**Error Handling:**
- 400 Bad Request Error:
    - If the given column to sort by does not exist within the database, returns an error with the response: "Invalid or missing parameters. Try again."
- 500 Internal Server Error:
    - If an error occurred on the server, returns an error with the response: "An error occurred during account login. Please try again later."

## Get product information
**Request Format:** /detail/:item

**Request Type:** GET
**Parameters:** "item" (String)

**Returned Data Format**: JSON

**Description:** Retrieves information for a specific product

**Example Request:** /detail/paper-straws

**Example Response:**

```
{
    “name”: “Paper Straws”,
    “rating”: 5,
    “description”: “Paper straws are eco-friendly.”,
    <!-- “image”: “img/placeholder-product.png”,
    “dimensions”:  “0.4 in x 0.4 in x 6 in”,
    “materials”: “paper”, -->
    "reviews": [
        “review1”,
        “review2”,
        ...
        "reviewn"
    ]
}
```

**Error Handling:**
- 404 Not Found (plain text):
    - If the product name is not in the database, returns an error with response: “Product not found.”

- 500 Internal Server Error (plain text):
    - If an error occured on the server, returns an error with the response: "An error occurred during information retrieval. Please try again later."

**Error Handling:**
- 404 Not Found (plain text):
    - If the product name is not in the database, returns an error with response: “Product not found.”

- 500 Internal Server Error (plain text):
    - If an error occured on the server, returns an error with the response: "An error occurred during information retrieval. Please try again later."

## Get product recommendations
**Request Format:** /recommendations

**Request Type:** POST
**Parameters:** "username" (String)

**Returned Data Format**: Plain Text

**Description:** Returns a list of recommended products for the logged in user

**Example Request:**

POST request: /recommendations
{
    "username" = "user1"
}

**Example Response:**

```
bag2
bag3
bag4
bag5
bag6
```

**Error Handling:**
- 401 Unauthorized (plain text):
    - If the user with username is not logged in, returns an error with response: "User not logged in. Please log in to see recommendations."

- 500 Internal Server Error (plain text):
    - If an error occurred on the server, returns an error with the response: "An error occurred. Please try again later."

## Get ads
**Request Format:** /ad/:quantity

**Request Type:** GET
**Parameter:** "quantity" (int)

**Returned Data Format**: Plain Text

**Description:** Retrieves a certain number of ads

**Example Request:** /ad/4

**Example Response:**

```
img/ad1.png
img/ad2.png
img/ad7.png
img/ad4.png
```

**Error Handling:**
- 400 Bad Request Error (plain text):
    - If the user passes in a quantity of 0, returns an error with response: "Invalid quantity."

- 500 Internal Server Error (plain text):
    - If an error occured on the server, returns an error with the response: “An error occurred during retrieval. Please try again later.”

## Review
**Request Format:** /feedback

**Request Type:** POST
**Parameters:** "username" (String), "review" (String), "rating" (double), "item" (String)

**Returned Data Format**: Plain text

**Description:** Submits a user review to the current product page

**Example Request:**
POST request: /feedback
{
    "username": "user1",
    "date": "08-18-2024",
    "review": "Works well! Works well! Works well!",
    "rating": 5.0
}

**Example Response:**

```
"Review successfully submitted."
```

**Error Handling:**
- 400 Bad Request Error (plain text):
    - If review length does not exceed 20 characters, returns an error with the response: "Review is too short. Please try again."

- 500 Internal Server Error (plain text):
    - If an error occured on the server, returns an error with the response: “An error occurred during retrieval. Please try again later.”

## Account Information - Transactions
**Request Format:** /account/my-transactions

**Request Type:** POST
**Parameters:** "username" (String)

**Returned Data Format**: JSON

**Description:** Returns the user's past transactions

**Example Request:** /account/my-transactions

**Example Response:**

```
{
    "Transaction1": {
        “date: “08-21-2024”
        “confirmation-num”: “XXXXX-XXXXX”,
        “items”: [
            {
            “name”: “product1”,
            “price”: “$X.XX”,
            “quantity”: 5
            },
            {
            “name”: “product2”,
            “price”: “$X.XX”,
            “quantity”: 5
            },
            {
            “name”: “product1”,
            “price”: “$X.XX”,
            “quantity”: 5
            }
        ],
        “subtotal”: “$A.AA”,
        “discount”: “B.BB”,
        “tax”: “C.CC”,
        “total”: “D.DD”
    },
    "Transaction2": {
        “date: “08-20-2024”
        “confirmation-num”: “XXXXX-XXXXX”,
        “items”: [
            {
            “name”: “product1”,
            “price”: “$X.XX”,
            “quantity”: 5
            },
            {
            “name”: “product2”,
            “price”: “$X.XX”,
            “quantity”: 5
            },
            {
            “name”: “product1”,
            “price”: “$X.XX”,
            “quantity”: 5
            }
        ],
        “subtotal”: “$A.AA”,
        “discount”: “B.BB”,
        “tax”: “C.CC”,
        “total”: “D.DD”
    },
}
```

**Error Handling:**
- 404 Not Found Error (plain text):
    - If user has no recorded transactions available, returns an error with response: "No previous transactions found."
- 500 Internal Server Error (plain text):
    - If an error occurred on the server, returns an error with the response: "An error occured during retrieval. Please try again later"

## New Transaction
**Request Format:** /account/new-transaction

**Request Type:** POST
**Parameters:** "username" (String), "item" (String), "quantity" (int)

**Returned Data Format**: Plain Text

**Description:** Adds the user’s newest transaction to their account records

**Example Request:**
POST request: /account/new-transaction
{
    "username": "user1",
    "item": "bag1",
    "quantity": 2
}

**Example Response:**

```
"Transaction successfully recorded."
```

**Error Handling:**
- 400 Bad Request Error (plain text):
    - If any of the parameters do not exist within the database, returns an error with response: "Incorrect parameters. Please try again."

- 500 Internal Server Error (plain text):
    - If an error occurred on the server, returns an error with the response: "An error occurred processing the transaction. Please try again later."
