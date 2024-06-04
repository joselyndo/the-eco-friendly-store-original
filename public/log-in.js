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
  const LOG_IN_ENDPOINT = "/log-in";

  window.addEventListener("load", init);

  /**
   * Initializes the log in page
   */
  function init() {
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
      localStorage.setItem("user", id("username").value);
      localStorage.setItem("loggedIn", "true");
      location.assign("index.html");
    } catch (error) {
      addLogInError();
    }
  }

  /**
   * Adds a log in error to the webpage
   */
  function addLogInError() {
    let parent = id("log-in");
    let hasMessage = qs("#log-in p");

    if (hasMessage === null) {
      let errorMessage = gen("p");
      errorMessage.textContent = "Error in submitting credentials. Please try again.";
      errorMessage.classList.add("error");
      parent.prepend(errorMessage);
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
})();