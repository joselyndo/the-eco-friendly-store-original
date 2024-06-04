CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP,
    transactions_history TEXT,
    balance REAL,
    logged_in TEXT
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT,
    image TEXT,
    description TEXT,
    category TEXT,
    price REAL,
    rating REAL,
    stock INTEGER
);

CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    item_id INTEGER,
    item TEXT,
    review TEXT,
    rating REAL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (item_id) REFERENCES products (id)
);

CREATE TABLE transactions (
    transaction_code INTEGER PRIMARY KEY,
    user_id INTEGER,
    cart TEXT,
    total INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
