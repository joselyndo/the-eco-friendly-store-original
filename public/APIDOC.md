# ECommerece Store API Documentation
*Fill in a short description here about the API's purpose.*

## Create account
**Request Format:** /create-account endpoint with 3 POST parameters in the format "username", "email", and "password"

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Creates a new user account if the username is unique

**Example Request:** /create-account with POST parameters “username=user1”, “email=user1(at)email.com”, “password=pass1”

**Example Response:**

```
Account successfully created.
```

**Error Handling:**
- 400 errors (all plain text):
    - If there is already a user with the given username, returns error with response: "There is already a user with the username [inputted username]. Please create a different username."
- 500 errors (all plain text):
    - If an error occured on the server, returns error with the response: “An error occurred during account creation. Please try again later.”


## Log into account
**Request Format:** /log-in endpoint with 2 POST parameters in the format "username" and "password"

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Logs the user in upon successful verification

**Example Request:** /log-in with POST parameters “username=user1” and “password=pass1”

**Example Response:**

```
“Login successful.”
```

**Error Handling:**
- 400 errors (all plain text):
    - If the password does not match the actual password for the given username, returns error with response: “Incorrect username or password. Please try again.”
- 500 errors (all plain text):
    - If an error occured on the server, returns error with the response: “An error occurred during account login. Please try again later.”


## Get products
**Request Format:** /products

**Request Type:** GET

**Returned Data Format**: Plain text

**Description:** Retrieves all products or retrieves certain products with a specified product name and/or filters

**Example Request 1:** /products

**Example Response 1:**
```
Compostable trash bags
Reusable metal straws
Paper straws
Recycled notebook
Reusable shopping bag
Reusable tote bag
Stainless steel water bottle
```

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
There are no results for the given criteria
```
**Error Handling:**
- 500 errors (all plain text):
    - If an error occured on the server, returns error with the response: “An error occurred. Please try again later.”


## Get product information
**Request Format:** /product/:productName

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves information for a specific product

**Example Request:** /product/paper-straws

**Example Response:**
*Fill in example response in the {}*

```
{
    “name”: “Paper Straws”,
    “rating”: 5,
    “image”: “img/placeholder-product.png”,
    “description”: “Paper straws are eco-friendly.”,
    “dimensions”:  “0.4 in x 0.4 in x 6 in”,
    “materials”: “paper”,
    "reviews": [
        “review1”, 
        “review2”,
        ...
        "reviewn"
    ]
}
```

**Error Handling:**
- 400 errors (all plain text):
    - If the produce name is not in the database, returns error with response: “This product is not in the database.”
- 500 errors (all plain text):
    - If an error occured on the server, returns error with the response: "An error occurred during information retrieval. Please try again later."


## Get product recommendations
**Request Format:** /recommendations endpoint with 1 POST parameter of the form "username"

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## Get ads
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 7 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 8 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: JSON

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the {}*

```json
{

}
```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 9 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: JSON

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the {}*

```json
{

}
```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 10 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 11 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 12 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*


## *Fill in Endpoint 13 Title*
**Request Format:** *Fill in example request format, i.e. the path*

**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Fill in an example of the error handling*
