/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * [File description]
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Initializes the ________
   */
  function init() {
    displayProductsOnHome();
  }

  /**
   * Displays products onto the home page
   */
  async function displayProductsOnHome() {
    try {
      let res = await fetch();
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
  }

  /**
   * Adds a message onto the web page about an error fetching data
   */
  function handleQueryError() {
  }

  /**
   *  Adds a message onto the web page about an error logging in or creating an account
   */
  function handleAccountError() {

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