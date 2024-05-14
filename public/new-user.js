/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This new-user.js adds functionality to the website's create a new user page, allowing users to
 * submit or attempt to submit credentials for a new account.
 */

"use strict";

(function() {
  const NEW_ACC_ENDPOINT = "[new account endpoint]";
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 5;

  window.addEventListener("load", init);

  /**
   * Initializes the account creation page
   */
  function init() {
    getAds();
    qs("#create-user form").addEventListener("submit", function(event) {
      event.preventDefault();
      submitCredentials();
    });
  }

  /**
   * Submits the user input to log in and responds differently based on the result
   */
  async function submitCredentials() {
    try {
      let credentials = new FormData(qs("#create-user form"));
      let res = await fetch(NEW_ACC_ENDPOINT, {
        method: "POST",
        body: credentials
      });
      await statusCheck(res);
      location.assign("my-account.html");
    } catch (error) {
      addAccountCreationError();
    }
  }

  /**
   * Adds an account creation error
   */
  function addAccountCreationError() {
    let errorMessage = gen("p");
    errorMessage.text = "Error in creating a new account. Please try again.";
    errorMessage.classList.add("error");

    let parent = id("create-user");
    parent.insertBefore(errorMessage, qs("#create-user h2"));
  }

/**
 * Displays ads onto the home page
 */
  function getAds() {
    let adImages = qsa("main > img");
    for (let img = 0; img < adImages.length; img++) {
      let randNum = Math.floor(Math.random() * NUM_ADS) + 1;
      adImages[img].src = IMG_ADS_DIR + randNum + ADS_ENDING;
      adImages[img].alt = "ad " + randNum;
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