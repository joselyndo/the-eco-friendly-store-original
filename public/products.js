/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This products.js adds functionality to the website's search and navigation side bar and
 * adds queried products.
 */

"use strict";

(function() {
  const ALL_PRODUCTS_ENDPOINT = "/products/all";
  const SPECIFIC_PRODUCT_ENDPOINT = "/details/";
  const REVIEWS_ENDPOINT = "/reviews/";
  const FEEDBACK_ENDPOINT = "/feedback";
  const IMG_FILE_EXT = ".jpg";
  const TEN_SECONDS = 10000;
  const TOTAL_PRODUCTS = 30;
  let TO_DISPLAY;

  window.addEventListener("load", init);

  /** Initializes the products page */
  function init() {
    displayAllProducts();
    initButtons();
    id("toggle-layout").addEventListener("change", function(event) {
      updateCheckbox();
      updateProductsLayout();
    });

    id("load").addEventListener("click", function() {
      addProductsToPage(TO_DISPLAY, qs("#products-page section"));
      TO_DISPLAY = null;
      let cards = qsa("#products-page section > div");
      console.log(cards.length);
      if (TOTAL_PRODUCTS > cards.length) {
        id("load").disabled = false;
      } else {
        id("load").disabled = true;
      }
    });

    // if (window.sessionStorage.getItem("search") !== null) {
    //   id("search-entry").value = window.sessionStorage.getItem("search");
    //   searchForProductName();
    // }

    // id("search-bar").addEventListener("submit", function(event) {
    //   event.preventDefault();
    //   searchForProductName();
    // });
    // id("filter-button").addEventListener("click", filterProducts);
    // qs(".search-entry").addEventListener("input", function() {
    //   if (qs(".search-entry").value.trim() !== "") {
    //     qs(".search-button").disabled = false;
    //   } else {
    //     qs(".search-button").disabled = true;
    //   }
    // });
    // qs(".search-button").addEventListener("click", searchButton);
  }

  /** Initializes the interactability of buttons on the page */
  function initButtons() {
    id("back-to-all-products-button").addEventListener("click", switchProductViews);

    id("feedback").addEventListener("submit", function(event) {
      event.preventDefault();
      postProductFeedback();
    });

    qs("textarea").addEventListener("input", function() {
      changeButton(this, id("submit-button"));
    });

    id("search-entry").addEventListener("input", function() {
      changeButton(this, this.nextElementSibling);
    });
  }

  /** Displays the products that the user searched for */
  async function searchForProductName() {
    try {
      let productName = new FormData(id("search-bar"));
      prevSearched = productName;
      let res = await fetch(PRODUCTS_ENDPOINT, {
        method: "GET",
        body: productName
      });
      await statusCheck(res);
      addProductsToPage(res, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
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
      addProductsToPage(res, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
      prevSearched = null;
    }
  }

  /** Displays all products */
  async function displayAllProducts() {
    try {
      let res = await fetch(ALL_PRODUCTS_ENDPOINT);
      await statusCheck(res);
      res = await res.json();
      TO_DISPLAY = res.splice(res.length/2, res.length/2)
      addProductsToPage(res, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
    }
  }

  function searchButton() {
    // TODO: implement
  }

  /**
   * Adds product cards to the home page
   * @param {JSON} res - JSON file containing information about the products
   * @param {HTMLElement} productsContainer - HTMLElement to contain information about the products
   */
  function addProductsToPage(res, productsContainer) {
    if (id("load").disabled) {
      productsContainer.innerHTML = "";
    }
    for (let item = 0; item < res.length; item++) {
      let productImg = gen("img");
      productImg.src = "img/products/" + res[item]["image"] + IMG_FILE_EXT;
      productImg.alt = res[item]["item"];

      let productName = gen("p");
      productName.textContent = res[item]["item"];

      let productPrice = gen("p");
      productPrice.textContent = "$" + res[item]["price"];

      let productRating = gen("p");
      productRating.textContent = "Rating: " + res[item]["rating"];

      let productCard = gen("div");
      productCard.appendChild(productImg);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);
      productCard.appendChild(productRating);
      productCard.addEventListener("click", displaySpecificProduct);

      productsContainer.appendChild(productCard);
    }
  }

  /** Shows a product and its details onto the page*/
  function displaySpecificProduct() {
    switchProductViews();

    let productName = this.firstElementChild.nextElementSibling.textContent;
    addProductInfo(productName);
    addReviews(productName);

    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      id("feedback").classList.remove("hidden");
      id("feedback").classList.add("visible");
    }
  }

  /** Switches between showing all the products and a single product */
  function switchProductViews() {
    id("products-view").classList.toggle("hidden");
    id("selected-product-view").classList.toggle("hidden");
  }

  /**
   * Adds a product's information to the screen
   * @param {String} productName - name of the product whose info will be added to the screen
   */
  async function addProductInfo(productName) {
    try {
      let results = await fetch(SPECIFIC_PRODUCT_ENDPOINT + productName);
      await statusCheck(results);
      results = await results.json();
      populateProductDescription(results);
    } catch (error) {
      handleQueryError(id("selected-product-page"));
    }
  }

  /**
   * A helper function to add a product's information to the screen
   * @param {JSON} productInfo - object containing information to add to the screen
   */
  function populateProductDescription(productInfo) {
    let productSection = id("product-description");
    productSection.innerHTML = "";

    let itemImage = gen("img");
    itemImage.src = "img/products/" + productInfo.image + IMG_FILE_EXT;
    itemImage.alt = productInfo.item;

    let itemName = gen("h2");
    itemName.textContent = productInfo.item;
    let itemPrice = gen("p");
    itemPrice.textContent = "$" + productInfo.price;
    let itemRating = gen("p");
    itemRating.textContent = "Rating: " + productInfo.rating;
    let itemStock = gen("p");
    itemStock.textContent = "Available stock: " + productInfo.stock;
    let itemDescription = gen("p");
    itemDescription.textContent = productInfo.description;

    productSection.appendChild(itemImage);
    productSection.appendChild(itemName);
    productSection.appendChild(itemPrice);
    productSection.appendChild(itemRating);
    productSection.appendChild(itemStock);
    productSection.appendChild(itemDescription);

    addPurchaseButtons(productSection);
  }

  /**
   * Adds buttons to a section of the page
   * @param {HTMLElement} productSection - the section that gets buttons added
   */
  function addPurchaseButtons(productSection) {
    let bulkPurchaseLabel = gen("label");
    bulkPurchaseLabel.textContent = "Quantity: ";

    let bulkInput = gen("input");
    bulkInput.id = "bulk";
    bulkInput.type = "number";
    bulkInput.min = "1";
    bulkInput.step = "1";
    bulkInput.value = "1";
    bulkInput.required = true;
    bulkPurchaseLabel.appendChild(bulkInput);

    let buyBtn = gen("button");
    buyBtn.id = "buy-btn";
    buyBtn.textContent = "Buy item";
    buyBtn.addEventListener("click", buyItem);

    let addToCartBtn = gen("button");
    addToCartBtn.id = "add-to-cart-btn";
    addToCartBtn.textContent = "Add item to cart";
    addToCartBtn.addEventListener("click", addItemToCart);

    productSection.appendChild(bulkPurchaseLabel);
    productSection.appendChild(buyBtn);
    productSection.appendChild(addToCartBtn);

    disablePurchaseButtons();
  }

  /** Disables or enables the purchase buttons depending on a user's logged in status */
  function disablePurchaseButtons() {
    let buyBtn = id("buy-btn");
    let cartBtn = id("add-to-cart-btn");
    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      buyBtn.disabled = false;
      cartBtn.disabled = false;
    } else {
      buyBtn.disabled = true;
      cartBtn.disabled = true;
    }
  }

  function buyItem() {
    // TODO: implement
  }

  function addItemToCart() {
    // TODO: implement
  }

  /**
   * Adds a product's reviews to the page
   * @param {String} productName - the name of the product whose reviews will be retrieved
   */
  async function addReviews(productName) {
    try {
      let results = await fetch(REVIEWS_ENDPOINT + productName);
      await statusCheck(results);
      results = await results.json();
      handleReviews(results);
    } catch (error) {
      handleQueryError(id("selected-product-page"));
    }
  }

  /**
   * A helper function to add a product's reviews to the page
   * @param {JSON} results - the resulting reviews for a product
   */
  function handleReviews(results) {
    let reviewSection = id("reviews-section");
    reviewSection.innerHTML = "";
    let reviewsHeader = gen("h2");
    reviewsHeader.textContent = "Reviews";
    reviewSection.appendChild(reviewsHeader);
    if (results.length === 0) {
      let message = gen("p");
      message.textContent = "No reviews for this product so far.";
      reviewSection.appendChild(message);
    } else {
      for (let review = 0; review < results.length; review++) {
        let reviewCard = createReviewCard(results[review]);
        reviewSection.appendChild(reviewCard);
      }
    }
  }

  /**
   * Creates a review card with the given information
   * @param {JSON} reviewInfo - information about a specific review
   * @returns {HTMLElement} - the card containing a review
   */
  function createReviewCard(reviewInfo) {
    let username = gen("p");
    username.textContent = reviewInfo.username;

    let date = gen("p");
    date.textContent = "Date: " + new Date(reviewInfo.date).toLocaleDateString();

    let rating = gen("p");
    rating.textContent = "Rating: " + reviewInfo.rating;

    let reviewMetadata = gen("div");
    reviewMetadata.appendChild(username);
    reviewMetadata.appendChild(date);
    reviewMetadata.appendChild(rating);

    let review = gen("p");
    review.textContent = reviewInfo.review;

    let reviewCard = gen("div");
    reviewCard.appendChild(reviewMetadata);
    reviewCard.appendChild(review);

    return reviewCard;
  }

  /** Collects the feedback information */
  async function postProductFeedback() {
    try {
      let ratingButtons = qsa("#feedback input");
      let rating = 0;
      for (let input = 0; input < ratingButtons.length; input++) {
        if (ratingButtons[input].checked) {
          rating = ratingButtons[input].value;
        }
      }

      let itemName = qs("#product-description h2").textContent;
      let username = localStorage.getItem("user");
      let review = qs("textarea").value;

      let formToSubmit = new FormData();
      formToSubmit.append("item", itemName);
      formToSubmit.append("username", username);
      formToSubmit.append("rating", rating);
      formToSubmit.append("review", review);
      let result = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        body: formToSubmit
      });
      await statusCheck(result);
      result = await result.text();
      handleFeedbackResult(result, itemName);
    } catch (error) {
      handleQueryError(id("selected-product-page"));
    }
  }

  /**
   * Adds confirmation that the feedback was successfully collected
   * @param {String} result - the result to add to the screen
   * @param {String} itemName - the name of the item
   */
  function handleFeedbackResult(result, itemName) {
    let message = gen("p");
    message.textContent = result;
    id("feedback").append(message);
    setTimeout(function() {
      qs("#feedback p").remove();
    }, TEN_SECONDS);
    clearFeedbackForm();
    addReviews(itemName);
  }

  /** Clears the feedback form */
  function clearFeedbackForm() {
    let ratingButtons = qsa("#feedback input");
    for (let input = 0; input < ratingButtons.length - 1; input++) {
      ratingButtons[input].checked = false;
    }

    ratingButtons[ratingButtons.length - 1].checked = true;
    qs("textarea").value = "";
  }

  /** Changes the submit button depending on the text box's input */
  function changeButton(textContainer, button) {
    let reviewText = textContainer.value;
    reviewText = reviewText.trim();

    if (reviewText === "") {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }

  /** Changes the appearance of the checkbox */
  function updateCheckbox() {
    let toggleImgs = qsa("label img");
    for (let img = 0; img < toggleImgs.length; img++) {
      toggleImgs[img].classList.toggle("hidden");
    }
  }

  /** Toggles the layouts of the product page */
  function updateProductsLayout() {
    let productsContainer = qs("#products-page > section");
    productsContainer.classList.toggle("grid-layout");
    productsContainer.classList.toggle("list-layout");
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