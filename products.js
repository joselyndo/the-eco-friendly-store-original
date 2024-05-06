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
  const PRODUCTS_ENDPOINT = "[URL]/products?";
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 1;
  let prevSearched = null;

  window.addEventListener("load", init);

  /**
   * Initializes the products page
   */
  function init() {
    getAds();
    displayAllProducts();
    id("search-bar").addEventListener("submit", function(event) {
      event.preventDefault();
      searchForProductName();
    });
    id("filter-button").addEventListener("click", filterProducts);
  }

  /**
   * Displays ads onto the page
   */
  function getAds() {
    let adImages = qsa("main img");
    for (let img = 0; img < adImages.length; img++) {
      let randNum = Math.floor(Math.random() * NUM_ADS);
      adImages[img].src = IMG_ADS_DIR + randNum + ADS_ENDING;
      adImages[img].alt = "ad " + randNum;
    }
  }

  /**
   * Displays the products that the user searched for
   */
  async function searchForProductName() {
    try {
      let productName = new FormData(id("search-bar"));
      prevSearched = productName;
      let res = await fetch(PRODUCTS_ENDPOINT, {
        method: "GET",
        body: productName
      });
      await statusCheck(res);
      addProductsToPage(res, qs("#product-page section"));
    } catch (error) {
      handleQueryError(qs("#product-page section"));
      prevSearched = null;
    }
  }

  /**
   * Filters the products that are already displayed on the webpage. The products
   * that can be filtered are either all the products or products matching the
   * user's search phrase.
   */
  async function filterProducts() {
    try {
      let forms = qsa(".filter");
      if (prevSearched === null) {
        prevSearched = new FormData();
        prevSearched.append("search", "all");
      }

      for (let form = 0; form < forms.length; form++) {
        for (let keyValuePair of forms[form].entries()) {
          prevSearched.append(keyValuePair[0], keyValuePair[1]);
        }
      }

      let res = await fetch(PRODUCTS_ENDPOINT, {
        method: "GET",
        body: prevSearched
      });
      await statusCheck(res);
      addProductsToPage(res, qs("#product-page section"));
    } catch (error) {
      handleQueryError(qs("#product-page section"));
      prevSearched = null;
    }
  }

  /**
   * Displays all products
   */
  async function displayAllProducts() {
    try {
      let res = await fetch(PRODUCTS_ENDPOINT);
      await statusCheck(res);
      res = await res.json();
      addProductsToPage(res, qs("product-page section"));
    } catch (error) {
      handleQueryError(qs("product-page section"));
    }
  }

  /**
   * Adds product cards to the home page
   * @param {JSON} res - JSON file containing information about the products
   * @param {HTMLElement} productsContainer - HTMLElement to contain information about the products
   */
  function addProductsToPage(res, productsContainer) {
    productsContainer.innerHTML = "";
    for (let item = 0; item < res.length; item++) {
      let productImg = gen("img");
      productImg.src = res["image"]; // specific names may change
      productImg.alt = res["name"];

      let productName = gen("p");
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

  /**
   * Adds a message onto the web page about an error fetching data
   * @param {HTMLElement} productsContainer - HTMLElement to contain information about the products
   */
  function handleQueryError(productsContainer) {
    productsContainer.innerHTML = "";
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