import { render, render_json } from "./utils";
import { type ViewArgs, type Route } from "./utils";

import { authenticate, getProductById, getProducts, getUser } from "./storage";
import { generateSessionId, setSession, getCurrentUser, logoutUser } from "./session";

// HTML VIEWS

export async function home(req: Request) {
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    const data = {
        user: user,
        is_authenticated: is_authenticated
    };

    return render("./frontend/index.html", data);
}

export async function product_index(req: Request) {
    const products = getProducts();
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    const data = {
        user: user,
        is_authenticated: is_authenticated,
        products: products
    };

    return render("./frontend/product_index.html", data);
}

export async function product(req: Request, params?: ViewArgs) {
    const product_id = params!["id"];
    const product = getProductById(product_id);
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    const data = {
        user: user,
        is_authenticated: is_authenticated,
        product: product,
        product_id: product_id
    };

    return render("./frontend/product.html", data);
}

export async function profile(req: Request) {
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    const data = {
        user: user,
        is_authenticated: is_authenticated
    };

    return render("./frontend/profile.html", data);
}

export async function login(req: Request) {
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    const data = {
        user: user,
        is_authenticated: is_authenticated,
        errors: [] as String[]
    };

    if (req.method == "POST") {
        const formData = await req.formData();
        const user = getUser(formData.get("email")?.toString() || "");

        if (user == undefined) {
            data.errors.push("Invalid email or password");
            return render("./frontend/login.html", data);
        }

        const ok = authenticate(user, formData.get("password")?.toString() || "");

        if (ok) {
            // Create a session ID and set it as a cookie
            const sessionId = generateSessionId();
            setSession(sessionId, user);
            const response = new Response(null, {
                status: 302,
                headers: {
                    'Set-Cookie': `sessionId=${sessionId};`,
                    'Location': '/'
                }
            });
            return response;
        } else {
            data.errors.push("Invalid email or password");
            return render("./frontend/login.html", data);
        }
    }

    return render("./frontend/login.html", data);
}

export async function logout(req: Request) {
    logoutUser(req);
    return Response.redirect("/")
}

// JSON APIs

export async function products_api(req: Request) {
    const products = getProducts();

    return render_json(products);
}

// Route definitions

export const routes: Record<string, Route>  = {
    "/api/v1/getProducts": products_api,
    "/": home,
    "/products": product_index,
    "/products/:id": product,
    "/login": login,
    "/logout": logout,
    "/profile": profile,
};