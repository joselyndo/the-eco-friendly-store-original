/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This view-transactions.js adds the individual transactions to a view transactions page, which is
 * specific to the logged in user.
 */

"use strict";

(function() {
  const USER_ENDPOINT = "[URL]/user?";
  const TRANSACTION_NUM = "Transaction ";
  const TRANSACTION_DATE = "Date of transaction: ";
  const CONFIRM_NUM = "Confirmation number: ";
  const PRICE = "Price: $";
  const QUANTITY = "Quantity: ";
  const ITEM_TOTAL = "Item total: ";
  const SUBTOTAL = "Subtotal: $";
  const DISCOUNT = "Discount: $";
  const TAX = "Tax: $";
  const TOTAL = "Total: $";

  window.addEventListener("load", init);

  /**
   * Initializes the user's view transactions page
   */
  function init() {
    displayAllTransactions();
  }

  /**
   * Displays all of the user's past transactions
   */
  async function displayAllTransactions() {
    try {
      let res = await fetch(USER_ENDPOINT);
      await statusCheck(res);
      res = await res.json();
      addTransactionsToPage(res, qs("main article"));
    } catch (error) {
      handleQueryError(qs("main article"));
    }
  }

  /**
   * Adds the user's transactions from res into transactionContainer so that the transactions are
   * displayed.
   * @param {JSON} res - JSON file containing information about the user's transactions
   * @param {HTMLElement} transactionsContainer - HTMLElement to contain the user's transactions
   */
  function addTransactionsToPage(res, transactionsContainer) {
    transactionsContainer.innerHTML = "";
    for (let transaction = 0; transaction < res.length; transaction++) {
      let header = gen("h3");
      header.textContent = TRANSACTION_NUM + res[transaction]["id"];
      let itemList = addItems(transaction, res);
      let transactionPriceInfo = addTransactionPriceInfo(transaction, res);

      let transactionSection = gen("section");
      transactionSection.appendChild(header);
      transactionSection.appendChild(genParagraphElement(TRANSACTION_DATE + res["date"]));
      transactionSection.appendChild(genParagraphElement(CONFIRM_NUM + res["confirmation-num"]));
      transactionSection.appendChild(itemList);
      transactionSection.appendChild(transactionPriceInfo);
      transactionsContainer.appendChild(transactionSection);
    }
  }

  /**
   * Creates a nested unordered list containing information about the items in a transaction
   * @param {Number} transactionNum - a number representing which transaction whose item information
   * is being added to the unordered list
   * @param {JSON} res - the JSON file with the transaction information
   * @return {HTMLUListElement} an unordered list containing item information from a transaction
   */
  function addItems(transactionNum, res) {
    let itemList = gen("ul");
    for (let itemNum = 0; itemNum < res[transactionNum]["items"].length; itemNum++) {
      let itemInfo = gen("ul");
      itemInfo.appendChild(genListElement(PRICE + res[transactionNum]["items"][itemNum]["price"]));
      itemInfo.appendChild(
        genListElement(QUANTITY + res[transactionNum]["items"][itemNum]["quantity"])
      );
      itemInfo.appendChild(
        genListElement(ITEM_TOTAL + res[transactionNum]["items"][itemNum]["item-total"])
      );
      let item = genListElement(res[transactionNum]["items"][itemNum]["name"]);
      item.appendChild(itemInfo);
      itemList.appendChild(item);
    }

    return itemList;
  }

  /**
   * Creates an unordered list containing transaction price information like
   * subtotal, discount, tax, and total
   * @param {Number} transactionNum - a number representing which transaction whose information
   * is being added to an unordered list
   * @param {JSON} res - the JSON file with the transaction information
   * @return {HTMLUListElement} an unordered list containing transaction price information
   */
  function addTransactionPriceInfo(transactionNum, res) {
    let transactionPriceInfo = gen("ul");
    transactionPriceInfo.appendChild(genListElement(SUBTOTAL + res[transactionNum]["subtotal"]));
    transactionPriceInfo.appendChild(genListElement(DISCOUNT + res[transactionNum]["discount"]));
    transactionPriceInfo.appendChild(genListElement(TAX + res[transactionNum]["tax"]));
    transactionPriceInfo.appendChild(genListElement(TOTAL + res[transactionNum]["total"]));
    return transactionPriceInfo;
  }

  /**
   * Creates a paragraph to hold text content
   * @param {String} message - the message that the paragraph element will hold
   * @return {HTMLParagraphElement} a paragraph containing text to be displayed
   */
  function genParagraphElement(message) {
    let paragraphElement = gen("p");
    paragraphElement.textContent = message;
    return paragraphElement;
  }

  /**
   * Creates a list entry element that holds text
   * @param {String} message - the message that the list element will hold
   * @return {HTMLElement} a list entry element containing text to be displayed
   */
  function genListElement(message) {
    let listElement = gen("li");
    listElement.textContent = message;
    return listElement;
  }

  /**
   * Adds a message onto the web page about an error fetching data
   * @param {HTMLElement} transactionContainer - HTMLElement to contain the transaction information
   */
  function handleQueryError(transactionContainer) {
    transactionContainer.innerHTML = "";
    let errorMessage = gen("p");
    errorMessage.textContent = "Error. Please try again later.";
    errorMessage.classList.add("error");
    transactionContainer.appendChild(errorMessage);
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
   * Returns the element that matches the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object} DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }
})();