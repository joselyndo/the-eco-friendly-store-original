/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This cart.js adds functionality to the user's shopping cart page, allowing users
 * to check out and purchase all their items at once.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * Initializes the log in page
   */
  function init() {
    if (window.localStorage.getItem("confirmPurchase") === "true") {
      id("confirm").checked = true;
    }
    getCart();
    getHistory();
    id("toggle-layout").addEventListener("change", function() {
      updateCheckbox();
      toggleView();
    });
    id("clear").addEventListener("click", clearCart);
    id("checkout").addEventListener("click", function() {
      if (window.localStorage.getItem("confirmPurchase") === "true") {
        let username = window.localStorage.getItem("user");
        let cart = window.localStorage.getItem("cart");
        checkOut(username, cart);
        window.localStorage.setItem("confirmPurchase", false);
      } else {
        let prompt = qs(".prompt");
        if (!prompt) {
          prompt = gen("p");
        }
        prompt.classList.add("prompt");
        prompt.textContent = "Please your confirm purchase.";
        id("cart").appendChild(prompt);
      }
    });
    id("confirm").addEventListener("change", confirmationStatus);
  }

  /**
   * Makes a fetch to update transactions and process the sale
   * @param {String} username - the user's username
   * @param {Array} cart - Contains a list of items in current cart
   */
  async function checkOut(username, cart) {
    let body = new FormData();
    let loggedIn = window.localStorage.getItem("loggedIn");

    if (loggedIn && username && cart) {
      body.append("username", username);
      body.append("cart", cart);

      try {
        let response = await fetch("/buy", {method: "POST", body: body});
        await statusCheck(response);
        let result = await response.json();
        clearCart();
        showButtons(false);
        getHistory();
        displayConfirmation(result);
      } catch (error) {
        addMsg("An error has occurred. Please try again.", true);
      }
    } else {
      addMsg("Error: must be logged in to check out from the cart", true);
    }
  }

  /**
   * Adds a message onto the string
   * @param {String} msg - the message to add onto the screen
   * @param {Boolean} isError - represents whether the message represents an error or not
   */
  function addMsg(msg, isError) {
    let cartContainer = id("cart");
    let newMsg = gen("p");
    newMsg.textContent = msg;
    if (isError) {
      newMsg.classList.add("error");
    }
    cartContainer.prepend(newMsg);
  }

  /**
   * Makes a POST fetch to retrieve details on user's cart
   */
  async function getCart() {
    let body = new FormData();
    let cart = window.localStorage.getItem("cart");
    let loggedIn = window.localStorage.getItem("loggedIn");

    if (loggedIn && cart) {
      showButtons(true);
      body.append("cart", cart);
      try {
        let response = await fetch("/cart", {method: "POST", body: body});
        await statusCheck(response);
        let result = await response.json();
        populateCart(result);
      } catch (error) {
        console.error(error);
      }
    } else {
      clearCart();
      showButtons(false);
    }
  }

  /**
   * Makes a POST fetch to retrieve details on user's transaction history.
   */
  async function getHistory() {
    let body = new FormData();
    let user = window.localStorage.getItem("user");
    let loggedIn = window.localStorage.getItem("loggedIn");

    if (loggedIn && user) {
      body.append("username", user);

      try {
        let response = await fetch("/transactions", {method: "POST", body: body});
        await statusCheck(response);
        let result = await response.json();
        populateHistory(result);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Generates DOM elements representing the user's cart.
   * @param {Object} items Details of each product
   */
  function populateCart(items) {
    let cart = id("cart-container");
    for (let i = 0; i < items.length; i++) {
      let productCard = gen("section");
      productCard.classList.add("card");

      let product = gen("div");
      let productName = gen("h4");
      productName.textContent = items[i]["item"];
      let productImg = gen("img");
      productImg.src = "img/products/" + items[i]["image"] + ".jpg";
      let productPrice = gen("p");
      productPrice.textContent = "$" + items[i]["price"];
      product.appendChild(productName);
      product.appendChild(productImg);
      product.appendChild(productPrice);

      let productDescription = gen("div");
      let productDescriptionP = gen("p");
      productDescriptionP.textContent = items[i]["description"];
      productDescription.appendChild(productDescriptionP);

      productCard.appendChild(product);
      productCard.appendChild(productDescription);
      cart.appendChild(productCard);
    }
  }

  /**
   * Generates DOM elements representing the user's transaction history.
   * @param {Object} transactions Details of transactions
   */
  function populateHistory(transactions) {
    let transactionsContainer = id("transactions");
    transactionsContainer.innerHTML = "";
    for (let i = 0; i < transactions.length; i++) {
      let items = transactions[i]["cart"];
      items = JSON.parse(items);

      let container = gen("details");
      container.classList.add("transaction");
      let summary = gen("summary");
      summary.textContent = "Transaction #" + transactions[i]["transaction_code"];
      let total = gen("h4");
      total.textContent = "Total: $" + transactions[i]["total"];

      let list = gen("ol");
      for (let j = 0; j < items.length; j++) {
        let listItem = gen("li");
        listItem.textContent = items[j];
        list.appendChild(listItem);
      }
      container.appendChild(summary);
      container.appendChild(list);
      container.appendChild(total);
      transactionsContainer.append(container);
    }
  }

  /**
   * Toggles cart and history views
   */
  function toggleView() {
    if (id("cart").classList.contains("hidden")) {
      id("cart").classList.remove("hidden");
      id("transactions").classList.add("hidden");
      qs("#cart-page h2").textContent = "Your Shopping Cart";
    } else {
      id("cart").classList.add("hidden");
      id("transactions").classList.remove("hidden");
      qs("#cart-page h2").textContent = "Your Transaction History";
    }
  }

  /**
   * Visually displays confirmation and processing of transaction.
   * @param {Object} result Contains new balance and transaction code
   */
  function displayConfirmation(result) {
    let container = gen("div");
    let success = gen("h4");
    let balance = gen("p");
    let code = gen("p");
    success.textContent = "Successful purchase!";
    balance.textContent = "Your new balance is: $" + result["balance"];
    code.textContent = "Transaction confirmation code #" + result["code"];
    container.appendChild(success);
    container.appendChild(balance);
    container.appendChild(code);
    id("cart-container").appendChild(container);
  }

  /**
   * Clears the user's stored cart
   */
  function clearCart() {
    id("cart-container").innerHTML = "";
    window.localStorage.setItem("cart", "");

    let inform = gen("p");
    inform.textContent = "There is nothing in your cart!";
    id("cart-container").appendChild(inform);
  }

  /** Notes that the user has confirmed their transaction */
  function confirmationStatus() {
    let value = id("confirm").checked;
    window.localStorage.setItem("confirmPurchase", value);
  }

  /** Changes the appearance of the checkbox */
  function updateCheckbox() {
    let toggleImgs = qsa("label img");
    for (let img = 0; img < toggleImgs.length; img++) {
      toggleImgs[img].classList.toggle("hidden");
    }
  }

  /**
   * Toggles button visibility
   * @param {boolean} flag boolean flag determining show or hide buttons
   */
  function showButtons(flag) {
    if (flag) {
      id("checkout").classList.remove("hidden");
      id("clear").classList.remove("hidden");
      id("confirm").classList.remove("hidden");
      id("confirm-label").classList.remove("hidden");
    } else {
      id("checkout").classList.add("hidden");
      id("clear").classList.add("hidden");
      id("confirm").classList.add("hidden");
      id("confirm-label").classList.add("hidden");
      if (qs(".prompt")) {
        qs(".prompt").remove();
      }
    }
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns a generated DOM object of type tag.
   * @param {string} tag element tag
   * @returns {object} DOM object created with tag
   */
  function gen(tag) {
    return document.createElement(tag);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that matches the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object} DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();