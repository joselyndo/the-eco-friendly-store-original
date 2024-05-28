/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This log-in.js adds functionality to the website's log in page, allowing users to
 * submit or attempt to submit credentials to log in.
 */

"use strict";

(function() {
  const LOG_IN_ENDPOINT = "[log in endpoint]";
  const IMG_ADS_DIR = "img/ads/";
  const ADS_ENDING = "-ad.png";
  const NUM_ADS = 5;

  window.addEventListener("load", init);

  /**
   * Initializes the log in page
   */
  function init() {
    getAds();
    qs("#log-in form").addEventListener("submit", function(event) {
      event.preventDefault();
      submitCredentials();
    });
  }

  /**
   * Submits user input to log in and responds differently based on the result
   */
  async function submitCredentials() {
    try {
      let credentials = new FormData(qs("#log-in form"));
      let res = await fetch(LOG_IN_ENDPOINT, {
        method: "POST",
        body: credentials
      });
      await statusCheck(res);
      location.assign("my-account.html");
    } catch (error) {
      addLogInError();
    }
  }

  /**
   * Adds a log in error to the webpage
   */
  function addLogInError() {
    let errorMessage = gen("p");
    errorMessage.text = "Error in submitting credentials. Please try again.";
    errorMessage.classList.add("error");

    let parent = id("log-in");
    parent.insertBefore(errorMessage, qs("#log-in h2"));
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