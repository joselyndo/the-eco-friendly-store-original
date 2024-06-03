/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This is the master.js file that is shared between all pages and provides
 * common functions.
 */
"use strict";

(function() {
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 5;

  window.addEventListener("load", init);

  /** Initializes the page */
  function init() {
    toggleLogIn();
    id("log-out-link").addEventListener("click", function() {
      logOut();
      toggleLogIn();
    });
    getAds();
  }

  /** Toggles the appearance of the navigation bar depending on if the user is logged in */
  function toggleLogIn() {
    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      id("log-in-link").classList.add("hidden");
      id("log-out-link").classList.remove("hidden");
      qs(".cart").classList.remove("hidden");
    } else {
      id("log-in-link").classList.remove("hidden");
      id("log-out-link").classList.add("hidden");
      qs(".cart").classList.add("hidden");
    }
  }

  /** Logs the user out */
  function logOut() {
    localStorage.setItem("cart", "");
    localStorage.setItem("user", "");
    localStorage.setItem("loggedIn", false);
  }

  /** Displays ads onto the home page */
  function getAds() {
    if ((qs(".sidebar-left")) && (qs(".sidebar-left"))) {
      let ad1 = gen("img");
      ad1.classList.add("ad");
      let randNum = Math.floor(Math.random() * NUM_ADS) + 1;
      ad1.src = IMG_ADS_DIR + randNum + ADS_ENDING;
      ad1.alt = "ad " + randNum;
      randNum = Math.floor(Math.random() * NUM_ADS) + 1;
      let ad2 = gen("img");
      ad2.classList.add("ad");
      ad2.src = IMG_ADS_DIR + randNum + ADS_ENDING;
      ad2.alt = "ad " + randNum;
      qs(".sidebar-left").appendChild(ad1);
      qs(".sidebar-right").appendChild(ad2);
    }
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
})();