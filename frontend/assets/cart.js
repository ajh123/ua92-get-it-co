/**
 * Sets the item in the cart to the chosen quanity.
 * 
 * @param {string} name The name of the item.
 * @param {number} quantity The chosen quantity.
 */
function setItem(name, quantity) {
    // Fetch the cart from the browser's local storage,
    // then convert it into a JavaScript object using JSON.
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    // Set the quanity of the by assinging by indexing the cart with "name"
    cart[name] = quantity;

    // Convert the updated cart object back to a JSON string and store it in the
    // browser's local storage
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

    // Then we index the cart object with "name" to fect the current value,
    // this may return `undefined` if the cart does not contian the item.
    return cart[name];
}

/**
 * Removes the item from the cart.
 * 
 * @param {string} name The name of the item.
 */
function removeItem(name) {
    // Fetch the cart from the browser's local storage,
    // then convert it into a JavaScript object using JSON.
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    // The "delete" keyword can be used remove any data from the program include object members
    delete cart[name];

    // Convert the updated cart object back to a JSON string and store it in the
    // browser's local storage
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Increments the quanity of an item by 1.
 * If the item does not exist in the cart its quanity will be set to 1.
 * 
 * @param {string} name The name of the item.
 */
function incItem(name) {
    // We fetch the item using our `getItem` method
    let quantity = getItem(name);
    // If the quanity is `undefined` then we set the quanity to 0
    if (quantity == undefined) {
        quantity = 0;
    }
    // Then increment the quanity
    quantity += 1;
    // Then use `setItem` to update the item's quanity in the cart
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
     // We fetch the item using our `getItem` method
    let quantity = getItem(name);
    // If the quanity is `undefined` then we set the quanity to 1
    if (quantity == undefined) {
        quantity = 1;
    }
    
    quantity = Math.max(1, quantity - 1);
    // Then use `setItem` to update the item's quanity in the cart
    setItem(name, quantity);
}

/**
 * Returns all items in the cart. The result object is not tied to the cart,
 * which results in modifactions being ignored.
 * 
 * This function makes a new cart instance if one does not exist.
 * 
 * @returns {object} An object whos keys represent item names and values represent the quanity.
 */
function getItems() {
    /** @type {Object|undefined} */
    // Fetch the cart from the local storage again and convert it to an object with JSON
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is `undefined` meaning it does not exist, then we create a new one
    if (cart == undefined) {
        cart = {};
    }

    // If we have created a new cart then we put it in the browser's local storage.
    // This will just do nothing if there is already a cart.
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

/**
 * Updates an element with the ID `"cart"` to contain a table which represents all items in the cart.
 */
function renderCart() {
    let cart = getItems(); // Get the all items in the cart

    // Construct a string to represent the HTML for a table, first start with the header.
    // As we can see there is the excat HTML definition for a table with each element inside
    // as expected.
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
        // A table row in HTML is a `<tr>` and each colloumn in the row is a `<td>`
        // Then by using the syntax `${quantity}` we can insert the varible content in the HTML string.
        //
        // We append to the existing table string since we want one object to represent the whole table.
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
 * Fetchs and item price frmo, the backend whos keys represent 
 * item names and values represent all item properties.
 * 
 * @param {string} item The name of the item.
 * @returns {number} Returns the item's price, or 0 if one does not exist.
 */
async function getItemCost(item) {
    const items = await fetch("/api/v1/getProducts");

    return items[item].price || 0;
}

/**
 * Takes a quanity from an input element with id `"quanity"` and sets an item using it.
 * This function will alert the user if the quanity is less then 1 and will alert when the
 * item is added to the cart.
 * 
 * @param {string} item The name of an item.
 */
function subbmitItem(item) {
    // This looks for a HTML element with the ID of `quanity`, this only exists in `product.html` and in that
    // file there is a form input with the ID of `quanity`. 
    // When the user subbmits that form, this function is called and this line will fetch the value of the input.
    const quantity = Number(document.getElementById("quanity").value);

    // We check if the quanity is less then 1, at runtime this is impossible as the form input as a minimun of 1, but
    // an attacker could inject code into the browser console and submit less then 1.
    if (quantity < 1) {
        // We use `alert` to show a dialog to the user.
        alert("Item quanity must be less than 1!")
    } else {
        // We fetch the current item and or if the result is undefined we set it to 1
        const currQuant = getItem(item) || 1;
        // We then put the item into the cart
        setItem(item, currQuant + quantity);
        // And alert to the user this operation was successfull
        alert(`${quantity} X ${item} added to cart.`)
    }
}