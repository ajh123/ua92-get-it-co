function setItem(name, quantity) {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == undefined) {
        cart = {};
    }

    cart[name] = quantity;

    localStorage.setItem("cart", JSON.stringify(cart));
}

function getItem(name) {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == undefined) {
        cart = {};
    }

    return cart[name];
}

function removeItem(name) {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == undefined) {
        cart = {};
    }

    delete cart[name];
    localStorage.setItem("cart", JSON.stringify(cart));
}

function incItem(name) {
    let quantity = getItem(name);
    if (quantity == undefined) {
        quantity = 0;
    }
    quantity += 1;
    setItem(name, quantity);
}

function decItem(name) {
    let quantity = getItem(name);
    if (quantity == undefined) {
        quantity = 1;
    }
    quantity = Math.max(1, quantity - 1);
    setItem(name, quantity);
}

function getItems() {
    /** @type {Object|undefined} */
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == undefined) {
        cart = {};
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

function renderCart() {
    let cart = getItems();
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

    let totalItems = 0;
    let totalCost = 0;

    for (let item in cart) {
        let quantity = cart[item];
        let cost = getItemCost(item);
        totalItems += quantity;
        totalCost += cost * quantity;

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

    document.getElementById("cart").innerHTML = table;
}

// Example function to get the cost of an item
function getItemCost(item) {
    return window.prices[item] || 0;
}

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