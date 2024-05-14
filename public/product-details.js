/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This product-details.js page adds the functionality to submit a review about a product on that
 * product's specific page.
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
    let submitButton = id("submit-button");
    submitButton.addEventListener("click", function(event) {
      event.preventDefault();
      addPost();
    });
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
})();