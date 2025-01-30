import { render, type ViewArgs, type Route } from "./utils";

import { getProductById, getProducts } from "./storage";

const user = {
    is_authenticated: false,
}

export function home(req: Request) {
    const data = {
        user: user
    };

    return render("./frontend/index.html", data);
}

export function product_index(req: Request) {
    const products = getProducts();

    const data = {
        user: user,
        products: products
    };

    return render("./frontend/product_index.html", data);
}

export function product(req: Request, params?: ViewArgs) {
    const product_id = params!["id"];
    const product = getProductById(product_id);

    const data = {
        user: user,
        product: product,
        product_id: product_id
    };

    return render("./frontend/product.html", data);
}

export function profile(req: Request) {
    const data = {
        user: user
    };

    return render("./frontend/profile.html", data);
}

export const routes: Record<string, Route>  = {
    "/": home,
    "/products": product_index,
    "/products/:id": product,
    "/profile": profile,
};