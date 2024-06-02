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
  const NEW_ACC_ENDPOINT = "/create-account";
  const ONE_SECOND = 1000;
  const WAIT_TIME = 10;
  const SECOND_STR = " second";

  window.addEventListener("load", init);

  /**
   * Initializes the account creation page
   */
  function init() {
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
      handleSuccess();
    } catch (error) {
      addAccountCreationError();
    }
  }

  /** Adds a sucessful account creation method which later redirects the user to the login screen*/
  function handleSuccess() {
    let successMsg = "Successful account creation! Redirecting to the login page in " +
                      WAIT_TIME + SECOND_STR + "s";
    addMessageToScreen(successMsg, false);
    setTimeout(function() {
      countdown(WAIT_TIME - 1);
    }, ONE_SECOND);
  }

  /**
   * Decrements the given number by one and adds a message reflecting this number
   * @param {Number} timeRemaining - a number representing the amount of time left in a countdown
   */
  function countdown(timeRemaining) {
    let msg = "Successful account creation! Redirecting to the login page in " + timeRemaining;

    if (timeRemaining === 0) {
      location.assign("log-in.html");
      msg += SECOND_STR + "s.";
    } else {
      if (timeRemaining === 1) {
        msg += SECOND_STR + ".";
      } else {
        msg += SECOND_STR + "s.";
      }

      setTimeout(function() {
        countdown(timeRemaining - 1);
      }, ONE_SECOND);
    }

    qs("#create-user p").textContent = msg;
  }

  /**
   * Adds the given message at the top center of the create account section
   * @param {String} message - the message to display onto the string
   * @param {Boolean} isError - a Boolean symbolizing if the message represents an error
   */
  function addMessageToScreen(message, isError) {
    let messageElement = gen("p");
    messageElement.textContent = message;

    if (isError) {
      messageElement.classList.add("error");
    }

    let hasMessage = qs("#create-user p");
    let parent = id("create-user");

    if (hasMessage) {
      parent.replaceChild(hasMessage, messageElement);
    } else {
      parent.prepend(messageElement);
    }
  }

  /** Adds an account creation error */
  function addAccountCreationError() {
    addMessageToScreen("Error in creating a new account. Please try again.", true);
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