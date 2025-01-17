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
        quantity = 0;
    }
    quantity = Math.max(0, quantity - 1);
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
