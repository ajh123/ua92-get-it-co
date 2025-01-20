/**
 * Sets the item in the cart to the chosen quanity.
 * 
 * @param {string} name The name of the item.
 * @param {number} quantity The chosen quantity.
 */
function setItem(name, quantity) {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    cart[name] = quantity;

    localStorage.setItem("cart", JSON.stringify(cart));
}


/**
 * Returns the quanity of a given item in the cart.
 * 
 * @param {string} name The name of the item.
 * @returns {number|undefined} The item's quantity.
 */
function getItem(name) {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    return cart[name];
}

/**
 * Removes the item from the cart.
 * 
 * @param {string} name The name of the item.
 */
function removeItem(name) {
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    delete cart[name];
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Increments the quanity of an item by 1.
 * If the item does not exist in the cart its quanity will be set to 1.
 * 
 * @param {string} name The name of the item.
 */
function incItem(name) {
    let quantity = getItem(name);
    if (quantity == undefined) {
        quantity = 0;
    }
    quantity += 1;
    setItem(name, quantity);
}

/**
 * Decrements the quanity of an item by 1.
 * This function will ensure that the quanity cannot be less then 1.
 * Also, if the item does not exist, the quanity will be set to 1.
 * 
 * @param {string} name The name of the item.
 */
function decItem(name) {
    let quantity = getItem(name);
    if (quantity == undefined) {
        quantity = 1;
    }
    quantity = Math.max(1, quantity - 1);
    setItem(name, quantity);
}

/**
 * Returns all items in the cart. The result object is not tied to the cart,
 * which results in modifactions being ignored.
 * 
 * @returns {object} An object whos keys represent item names and values represent the quanity.
 */
function getItems() {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == undefined) {
        cart = {};
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

/**
 * Updates an element with the ID `"cart"` to contain a table which represents all items in the cart.
 */
function renderCart() {
    let cart = getItems(); // Get the all items in the cart

    // Construct a string to represent the HTML for a table, first start with the header.
    let table = `
        <table border='1'>
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Product</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Initialise all totals to 0
    let totalItems = 0;
    let totalCost = 0;

    // Iterate through all items in the cart
    for (let item in cart) {
        let quantity = cart[item]; // Get the item quanity
        let cost = getItemCost(item); // Get item price
        totalItems += quantity; // Append to to total
        totalCost += cost * quantity; // ^^^

        // Append a new row to the table displaying item properties
        table += `
            <tr>
                <td>${quantity}</td>
                <td><a href="/products/${item}">${item}</a></td>
                <td><code>$${cost * quantity}</code></td>
                <td>
                    <button onclick="incItem('${item}'); renderCart();">+</button>
                    <button onclick="decItem('${item}'); renderCart();">-</button>
                    <button onclick="removeItem('${item}'); renderCart();">X</button>
                </td>
            </tr>
        `;
    }

    // Finish the table by appending HTML to close the table and include a footer with totals
    table += `
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="3">Total items</th>
                    <td><code>${totalItems}</code></td>
                </tr>
                <tr>
                    <th scope="row" colspan="3">Total cost</th>
                    <td><code>$${totalCost}</code></td>
                </tr>
            </tfoot>
        </table>
    `;

    // Overwrite an HTML element with ID of "cart" to contain the new table
    document.getElementById("cart").innerHTML = table;
}

/**
 * Fetchs and item price fro, a object located at `window.prices` whos keys represent 
 * item names and values represent prices.
 * 
 * @param {string} item The name of the item.
 * @returns {number} Returns the item's price, or 0 if one does not exist.
 */
function getItemCost(item) {
    return window.prices[item] || 0;
}

/**
 * Takes a quanity from an input element with id `"quanity"` and sets an item using it.
 * This function will alert the user if the quanity is less then 1 and will alert when the
 * item is added to the cart.
 * 
 * @param {string} item The name of an item.
 */
function subbmitItem(item) {
    const quantity = Number(document.getElementById("quanity").value);

    if (quantity < 1) {
        alert("Item quanity must be less than 1!")
    } else {
        const currQuant = getItem(item) | 0;
        setItem(item, currQuant + quantity);
        alert(`${quantity} X ${item} added to cart.`)
    }
}