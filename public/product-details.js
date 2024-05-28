/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This product-details.js page adds the functionality to submit a review about a product on that
 * product's specific page and buy products.
 */

"use strict";

(function() {
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 5;

  window.addEventListener("load", init);

  /**
   * Initializes page functionality.
   */
  function init() {
    getAds();
    let currentItem = qs("#product-description h2").textContent;
    let submitButton = id("submit-button");
    submitButton.addEventListener("click", function(event) {
      event.preventDefault();
      addPost();
    });
    let buyButton = id("buy-button");
    buyButton.addEventListener("click", function() {
      buyItem(currentItem);
    });
    let addToCartButton = id("add-to-cart");
    addToCartButton.addEventListener("click", function() {
      addToCart(currentItem);
    })
  }

  /**
   * Adds a post to the product's review feed.
   */
  function addPost() {
    let reviews = id("review-feed");
    let container = gen("div");
    let divUser = gen("div");
    let pUsername = gen("p");
    let imgRating = gen("img");
    let pDate = gen("p");
    let pText = gen("p");
    container.classList.add("review");
    pUsername.textContent = "Placeholder Username:"; // To change
    imgRating.src = "img/rating/5star.png"; // To change
    pDate.textContent = "Month Day, Year"; // To change
    pText.textContent = id("entry").value;
    divUser.appendChild(pUsername);
    imgRating.onload = function() {
      imgRating.height = pUsername.offsetHeight;
    };
    divUser.appendChild(imgRating);
    container.appendChild(divUser);
    container.appendChild(pDate);
    container.appendChild(pText);
    reviews.insertBefore(container, reviews.firstElementChild);
  }

  /**
   * Makes a fetch request to back-end to process item sale.
   * @param {string} itemName Name of the current product.
   */
  async function buyItem(itemName) {
    // CHECK IF USER IS LOGGED IN
    const url = "/buy/";
    const numToBuy = id("bulk").value;
    const param = itemName + "/" + numToBuy;

    try {
      let response = await fetch(url + param);
      statusCheck(response);
      let result = await response.json();
      boughtItem(result);

    } catch (error) {
      // Handle
      console.error(error);
    }
  }

  /**
   * Visual response to the user buying an item.
   * @param {JSON} itemData item information
   */
  function boughtItem(itemData) {
    // Implement DOM elements
    console.log("Your purchase was successful");
  }

  /**
   * Makes a call to back-end to update the user's shopping cart.
   */
  async function addToCart(itemName) {
    // CHECK IF USER IS LOGGED IN
    let cart = window.localStorage.getItem("cart");

    if (!cart) {
      cart = [];
    } else {
      cart = JSON.parse(cart);
    }

    cart.push(itemName);
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }

  /**
   * Visual response to the user adding an item to the cart.
   * @param {string} success Success/failure message.
   */
  function addedToCart(success) {
    // Implement DOM elements
    console.log(success);
  }

  /**
   * Displays ads onto the home page
   */
  function getAds() {
    let ad1 = gen("img");
    let randNum = Math.floor(Math.random() * NUM_ADS) + 1;
    ad1.src = IMG_ADS_DIR + randNum + ADS_ENDING;
    ad1.alt = "ad " + randNum;
    randNum = Math.floor(Math.random() * NUM_ADS) + 1;
    let ad2 = gen("img");
    ad2.src = IMG_ADS_DIR + randNum + ADS_ENDING;
    ad2.alt = "ad " + randNum;
    qs("main").prepend(ad1);
    qs("main").appendChild(ad2);
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
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns the element that matches the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object} DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }
})();