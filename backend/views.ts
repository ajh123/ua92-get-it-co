import { render, type ViewArgs, type Route } from "./utils";

const data = {
    user: {
        is_authenticated: false,
    }
};

export function home(req: Request) {
    return render("./frontend/index.html", data);
}

export function product_index(req: Request) {
    return render("./frontend/product_index.html", data);
}

export function product(req: Request, params?: ViewArgs) {
    const product_id = params!["id"];
    console.log(product_id);
    return render("./frontend/product.html", data);
}

export function profile(req: Request) {
    return render("./frontend/profile.html", data);
}

export const routes: Record<string, Route>  = {
    "/": home,
    "/products": product_index,
    "/products/:id": product,
    "/profile": profile,
};