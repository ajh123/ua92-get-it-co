/**
 * Sets the item in the cart to the chosen quantity.
 * 
 * @param {string} name The name of the item.
 * @param {number} quantity The chosen quantity.
 */
export function setItem(name, quantity) {
    // Fetch the cart from the browser's local storage,
    // then convert it into a JavaScript object using JSON.
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    // Set the quantity of the by assigning by indexing the cart with "name"
    cart[name] = quantity;

    // Convert the updated cart object back to a JSON string and store it in the
    // browser's local storage
    localStorage.setItem("cart", JSON.stringify(cart));
}


/**
 * Returns the quantity of a given item in the cart.
 * 
 * @param {string} name The name of the item.
 * @returns {number|undefined} The item's quantity.
 */
export function getItem(name) {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart is undefined that means the user has not made a cart yet
    if (cart == undefined) {
        cart = {}; // So we make a new one
    }

    // Then we index the cart object with "name" to fetch the current value,
    // this may return `undefined` if the cart does not contain the item.
    return cart[name];
}

/**
 * Removes the item from the cart.
 * 
 * @param {string} name The name of the item.
 */
export function removeItem(name) {
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
 * Increments the quantity of an item by 1.
 * If the item does not exist in the cart its quantity will be set to 1.
 * 
 * @param {string} name The name of the item.
 */
export function incItem(name) {
    // We fetch the item using our `getItem` method
    let quantity = getItem(name);
    // If the quantity is `undefined` then we set the quantity to 0
    if (quantity == undefined) {
        quantity = 0;
    }
    // Then increment the quantity
    quantity += 1;
    // Then use `setItem` to update the item's quantity in the cart
    setItem(name, quantity);
}

/**
 * Decrements the quantity of an item by 1.
 * This function will ensure that the quantity cannot be less then 1.
 * Also, if the item does not exist, the quantity will be set to 1.
 * 
 * @param {string} name The name of the item.
 */
export function decItem(name) {
     // We fetch the item using our `getItem` method
    let quantity = getItem(name);
    // If the quantity is `undefined` then we set the quantity to 1
    if (quantity == undefined) {
        quantity = 1;
    }
    
    quantity = Math.max(1, quantity - 1);
    // Then use `setItem` to update the item's quantity in the cart
    setItem(name, quantity);
}

/**
 * Returns all items in the cart. The result object is not tied to the cart,
 * which results in modifactions being ignored.
 * 
 * This function makes a new cart instance if one does not exist.
 * 
 * @returns {object} An object whos keys represent item names and values represent the quantity.
 */
export function getItems() {
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
export async function renderCart() {
    let cart = getItems(); // Get the all items in the cart

    // Construct a string to represent the HTML for a table, first start with the header.
    // As we can see there is the exact HTML definition for a table with each element inside
    // as expected.
    let table = `
        <table class="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th scope="col">Amount</th>
                    <th scope="col">Product</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody class="table-group-divider table-bordered">
    `;

    // Initialise all totals to 0
    let totalItems = 0;
    let totalCost = 0;

    // Iterate through all items in the cart
    for (let id in cart) {
        let quantity = cart[id]; // Get the item quantity
        let item = await getItemProperties(id); // Get item
        totalItems += quantity; // Append to to total

        totalCost += item.price * quantity; // ^^^

        // Append a new row to the table displaying item properties
        // A table row in HTML is a `<tr>` and each column in the row is a `<td>`
        // Then by using the syntax `${quantity}` we can insert the variable content in the HTML string.
        //
        // We append to the existing table string since we want one object to represent the whole table.
        table += `
            <tr>
                <td>${quantity}</td>
                <td><a href="/products/${id}">${item.name}</a></td>
                <td><code>$${item.price * quantity}</code></td>
                <td>
                    <button class="btn btn-secondary" onclick="incItem('${id}'); renderCart();">+</button>
                    <button class="btn btn-secondary" onclick="decItem('${id}'); renderCart();">-</button>
                    <button class="btn btn-danger" onclick="removeItem('${id}'); renderCart();">X</button>
                </td>
            </tr>
        `;
    }

    // Finish the table by appending HTML to close the table and include a footer with totals
    table += `
            </tbody>
            <tfoot class="table-group-divider table-bordered">
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

    if (Object.keys(cart).length == 0) {
        table = "<p>Your cart is empty!</p>";
    }

    // Overwrite an HTML element with ID of "cart" to contain the new table
    document.getElementById("cart").innerHTML = table;
}

/**
 * Fetches and item price from, the backend who's keys represent 
 * item names and values represent all item properties.
 * 
 * @param {string} item The name of the item id.
 * @returns {Promise<object|undefined>} Returns the item's properties.
 */
export async function getItemProperties(item) {
    const items = await (await fetch("/api/v1/products.json")).json();
    return items[item];
}

/**
 * Takes a quantity from an input element with id `"quantity"` and sets an item using it.
 * This function will alert the user if the quantity is less then 1 and will alert when the
 * item is added to the cart.
 * 
 * @param {string} item The name of an item.
 */
export function submitItem(item) {
    // This looks for a HTML element with the ID of `quantity`, this only exists in `product.html` and in that
    // file there is a form input with the ID of `quantity`. 
    // When the user submits that form, this function is called and this line will fetch the value of the input.
    const quantity = Number(document.getElementById("quantity").value);

    // We check if the quantity is less then 1, at runtime this is impossible as the form input as a minimum of 1, but
    // an attacker could inject code into the browser console and submit less then 1.
    if (quantity < 1) {
        // We use `alert` to show a dialog to the user.
        alert("Item quantity must be less than 1!")
    } else {
        // We fetch the current item and or if the result is undefined we set it to 1
        const currQuant = getItem(item) || 0;
        // We then put the item into the cart
        setItem(item, currQuant + quantity);
        // And alert to the user this operation was successful
        alert(`${quantity} X ${item} added to cart.`)
    }
}

window.setItem = setItem;
window.getItem = getItem;
window.removeItem = removeItem;
window.incItem = incItem;
window.decItem = decItem;
window.getItems = getItems;
window.renderCart = renderCart;
window.getItemProperties = getItemProperties;
window.submitItem = submitItem;
