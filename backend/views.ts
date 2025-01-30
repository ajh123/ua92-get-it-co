import { render } from "./utils";

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

export function product(req: Request) {
    return render("./frontend/product.html", data);
}

export function profile(req: Request) {
    return render("./frontend/profile.html", data);
}

export const routes: Record<string, (req: Request) => Promise<Response>> = {
    "/": home,
    "/products": product,
    "/products/:id": product_index,
    "/profile": profile,
};