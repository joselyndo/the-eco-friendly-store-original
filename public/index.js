/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This index.js adds functionality to the website's homepage, adding images
 * to deals, ads, and products.
 */

"use strict";

(function() {
  const DAYS_OF_WEEK = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday"
  ];
  const IMG_DEALS_DIR = "img/deals/";
  const DEAL_IMG_ENDING = "-deal-image.png";
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 5;
  const PRODUCTS_QUERY_URL = "";

  window.addEventListener("load", init);

  /**
   * Initializes the home page
   */
  function init() {
    getDeal();
    getAds();
    displayProductsOnHome();

    qs(".search-entry").addEventListener("input", function() {
      if (qs(".search-entry").value.trim() !== "") {
        qs(".search-button").disabled = false;
      } else {
        qs(".search-button").disabled = true;
      }
    });

    qs(".search-button").addEventListener("click", function() {
      event.preventDefault();
      searchButton();
    });
  }

  /**
   * Displays a deal onto the home page
   */
  function getDeal() {
    let today = new Date();
    let dealImg = qs("#promo img");
    dealImg.src = IMG_DEALS_DIR + DAYS_OF_WEEK[today.getDay()] + DEAL_IMG_ENDING;
    dealImg.alt = DAYS_OF_WEEK[today.getDay()] + " deal";
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
   * Displays products onto the home page
   */
  async function displayProductsOnHome() {
    try {
      let res = await fetch(PRODUCTS_QUERY_URL);
      await statusCheck(res);
      res = await res.json();
      addProductsToHome(res);
    } catch (error) {
      handleQueryError();
    }
  }

  /**
   * Adds product cards to the home page
   * @param {JSON} res - JSON file containing information about the products
   */
  function addProductsToHome(res) {
    let productsContainer = id("best-sellers");
    for (let item = 0; item < res.length; item++) {
      let productImg = gen("img");
      productImg.src = res["image"]; // specific names may change
      productImg.alt = res["name"];

      let productName = gen("h4");
      productName.textContent = res["name"];

      let productCard = gen("div");
      productCard.appendChild(productImg);
      productCard.appendChild(productName);
      productCard.addEventListener("click", function() {
        location.assign("product-details.html");
      });

      productsContainer.appendChild();
    }
  }

  function searchButton() {
    window.sessionStorage.setItem("search", qs(".search-entry").value);
    window.location.href = "http://localhost:8000/products.html";
  }

  /**
   * Adds a message onto the web page about an error fetching data
   */
  function handleQueryError() {
    let productsContainer = id("best-sellers");
    let errorMessage = gen("p");
    errorMessage.textContent = "Error. Please try again later.";
    errorMessage.classList.add("error");
    productsContainer.appendChild(errorMessage);
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