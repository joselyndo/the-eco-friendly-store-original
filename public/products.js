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
  const SEARCH_ENDPOINT = "/products/search";
  const FILTER_ENDPOINT = "/products/filter";
  const IMG_FILE_EXT = ".jpg";
  const TEN_SECONDS = 10000;
  let isSearchBarFilled = false;
  let isCategoryFilterFilled = false;
  let isPriceFilterFilled = false;
  let isRatingFilterFilled = false;

  window.addEventListener("load", init);

  /** Initializes the products page */
  function init() {
    initButtons();
    initSearchAndFilter();

    id("toggle-layout").addEventListener("change", function() {
      updateCheckbox();
      updateProductsLayout();
    });

    if (sessionStorage.getItem("search") !== null) {
      let productTerm = sessionStorage.getItem("search");
      sessionStorage.removeItem("search");
      id("search-entry").value = productTerm;
      let query = SEARCH_ENDPOINT + "?search-term=" + productTerm;
      searchAndDisplay(query);
    } else {
      displayAllProducts();
    }
  }

  /** Initializes the interactability of the Search and Filter panel */
  function initSearchAndFilter() {
    id("search-bar").addEventListener("submit", function(event) {
      event.preventDefault();
      searchForProducts();
    });

    id("clear-button").addEventListener("click", clearFilters);
    id("filter-button").addEventListener("click", searchAndOrFilterProducts);

    id("search-bar").addEventListener("change", function() {
      isSearchBarFilled = (id("search-entry").value.trim() !== "");
      enableSearchAndFilterBtn();
    });
    id("category-filter").addEventListener("change", function() {
      isCategoryFilterFilled = true;
      enableSearchAndFilterBtn();
    });
    id("price-filter").addEventListener("change", function() {
      isPriceFilterFilled = true;
      enableSearchAndFilterBtn();
    });
    id("ratings-filter").addEventListener("change", checkNums);
  }

  /** Checks if the rating boxes are empty or full */
  function checkNums() {
    let ratingInput = qsa("#ratings-filter input");
    let hasMinValue = (ratingInput[0].value !== "");
    let hasMaxValue = (ratingInput[1].value !== "");
    isRatingFilterFilled = (hasMinValue && hasMaxValue);
    enableSearchAndFilterBtn();
  }

  /** Checks if the required search and filter forms are filled */
  function enableSearchAndFilterBtn() {
    let filterBtn = id("filter-button");
    if (
      (!isSearchBarFilled) &&
      (isCategoryFilterFilled || isPriceFilterFilled || isRatingFilterFilled)
    ) {
      filterBtn.disabled = false;
      filterBtn.textContent = "Filter products";
    } else if (
      isSearchBarFilled &&
      isCategoryFilterFilled &&
      isPriceFilterFilled &&
      isRatingFilterFilled
    ) {
      filterBtn.textContent = "Search and Filter products";
      filterBtn.disabled = false;
    } else {
      filterBtn.textContent = "Search and Filter products";
      filterBtn.disabled = true;
    }
  }

  /** Clears the search bar and the filters */
  function clearFilters() {
    id("search-entry").value = "";
    id("ratings-min").value = "";
    id("ratings-max").value = "";

    let categoryBtns = qsa("#category-filter input");
    for (let btnNum = 0; btnNum < categoryBtns.length; btnNum++) {
      categoryBtns[btnNum].checked = false;
    }

    let priceRangeBtns = qsa("#price-filter input");
    for (let btnNum = 0; btnNum < priceRangeBtns.length; btnNum++) {
      priceRangeBtns[btnNum].checked = false;
    }

    id("filter-button").disabled = true;
    isSearchBarFilled = false;
    isCategoryFilterFilled = false;
    isPriceFilterFilled = false;
    isRatingFilterFilled = false;
    id("filter-button").textContent = "Search and Filter products";
    displayAllProducts();
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

  /**
   * Searches and filters products OR only filters products depending on
   * if the user is searching for a term or not
   */
  function searchAndOrFilterProducts() {
    if (id("search-entry").value.trim() !== "") {
      searchAndFilterProducts();
    } else {
      filterProducts();
    }
  }

  /** Keeps the products matching the filters */
  async function filterProducts() {
    try {
      let query = createFilterQuery();
      let results = await fetch(query);
      await statusCheck(results);
      results = await results.json();
      addProductsToPage(results, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
    }
  }

  /**
   * Creates a url to obtain filtered products from
   * @returns {String} - the url to obtain filtered products from
   */
  function createFilterQuery() {
    let query = "";

    let category = getCategory();
    if (category) {
      query += "product-category=" + category;
    }

    let maxPrice = getMaxPrice();
    if (maxPrice) {
      query = addAmpersand(query);
      query += "max-price=" + maxPrice;
    }

    let minRating = id("ratings-min").value;
    let maxRating = id("ratings-max").value;
    if (minRating && maxRating) {
      query = addAmpersand(query);
      query += "min-rating=" + minRating;
      query += "&max-rating=" + maxRating;
    }

    let url = FILTER_ENDPOINT + "?";
    return url + query;
  }

  /**
   * Returns the selected product category
   * @returns {String} - the selected product category
   */
  function getCategory() {
    let categoryBtns = qsa("#category-filter input");
    let category = "";
    for (let btnNum = 0; btnNum < categoryBtns.length; btnNum++) {
      if (categoryBtns[btnNum].checked) {
        category = categoryBtns[btnNum].value;
      }
    }
    return category;
  }

  /**
   * Returns the selected max price if selected, else return undefined
   * @returns {Number} - the selected max price for products to have
   */
  function getMaxPrice() {
    let maxPrice = undefined;
    let priceRangeBtns = qsa("#price-filter input");
    for (let btnNum = 0; btnNum < priceRangeBtns.length; btnNum++) {
      if (priceRangeBtns[btnNum].checked) {
        maxPrice = priceRangeBtns[btnNum].value;
      }
    }

    return maxPrice;
  }

  /**
   * Adds an ampersand (&) onto the end of the given string if the string is not empty
   * @param {String} string - the string that can receive an ampersand
   * @returns {String} - a string with or without an ampersand
   */
  function addAmpersand(string) {
    let returnedString = string;
    if (returnedString !== "") {
      returnedString += "&";
    }

    return returnedString;
  }

  /** Searches for products matching the user's input */
  function searchForProducts() {
    let productTerm = id("search-entry").value;
    let query = SEARCH_ENDPOINT + "?search-term=" + productTerm;
    searchAndDisplay(query);
  }

  /** Searches for products with filters added */
  function searchAndFilterProducts() {
    let url = SEARCH_ENDPOINT + "?search-term=" + id("search-entry").value;

    url += "&product-category=" + getCategory();
    url += "&max-price=" + getMaxPrice();
    url += "&min-rating=" + id("ratings-min").value;
    url += "&max-rating=" + id("ratings-max").value;
    searchAndDisplay(url);
  }

  /**
   * Searches for and displays the products that the user defined for
   * @param {String} url - the address to search products from
   */
  async function searchAndDisplay(url) {
    try {
      let res = await fetch(url);
      await statusCheck(res);
      res = await res.json();
      addProductsToPage(res, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
    }
  }

  /** Displays all products */
  async function displayAllProducts() {
    try {
      let res = await fetch(ALL_PRODUCTS_ENDPOINT);
      await statusCheck(res);
      res = await res.json();
      addProductsToPage(res, qs("#products-page section"));
    } catch (error) {
      handleQueryError(qs("#products-page section"));
    }
  }

  /**
   * Adds product cards to the products page
   * @param {JSON} res - JSON file containing information about the products
   * @param {HTMLElement} productsContainer - HTMLElement to contain information about the products
   */
  function addProductsToPage(res, productsContainer) {
    productsContainer.innerHTML = "";
    if (res.length === 0) {
      let noResultsMsg = gen("p");
      noResultsMsg.textContent = "No results found for the given search query and/or filters.";
      productsContainer.appendChild(noResultsMsg);
    } else {
      for (let item = 0; item < res.length; item++) {
        let productCard = createProductCard(res[item]);
        productsContainer.appendChild(productCard);
      }
    }
  }

  /**
   * Creates a product card
   * @param {JSON} res - JSON object containing information about a product
   * @returns {HTMLElement} - HTMLElement with information about a product
   */
  function createProductCard(res) {
    let productImg = gen("img");
    productImg.src = "img/products/" + res["image"] + IMG_FILE_EXT;
    productImg.alt = res["item"];

    let productName = gen("p");
    productName.textContent = res["item"];

    let productPrice = gen("p");
    productPrice.textContent = "$" + res["price"];

    let productRating = gen("p");
    productRating.textContent = "Rating: " + res["rating"];

    let productCard = gen("div");
    productCard.appendChild(productImg);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(productRating);
    productCard.addEventListener("click", displaySpecificProduct);
    return productCard;
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

    let addToCartBtn = gen("button");
    addToCartBtn.id = "add-to-cart-btn";
    addToCartBtn.textContent = "Add item to cart";
    addToCartBtn.addEventListener("click", addItemToCart);

    productSection.appendChild(bulkPurchaseLabel);
    productSection.appendChild(addToCartBtn);

    disablePurchaseButtons();
  }

  /** Disables or enables the purchase buttons depending on a user's logged in status */
  function disablePurchaseButtons() {
    let cartBtn = id("add-to-cart-btn");
    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      cartBtn.disabled = false;
    } else {
      cartBtn.disabled = true;
    }
  }

  /** Adds the item the user is currently looking at to the user's cart */
  function addItemToCart() {
    let item = qs("#product-description h2").textContent;
    let cart = window.localStorage.getItem("cart");

    if (cart) {
      cart = JSON.parse(cart);
    } else {
      cart = [];
    }

    cart.push(item);
    window.localStorage.setItem("cart", JSON.stringify(cart));
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

  /**
   * Changes the submit button depending on the text box's input
   * @param {HTMLElement} textContainer - the element containing text
   * @param {HTMLElement} button - the button associated with the text container
   */
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