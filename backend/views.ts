import { render, render_json } from "./utils";
import { type ViewArgs, type Route } from "./utils";

import { authenticate, getProductById, getProducts, getUser } from "./storage";
import { generateSessionId, setSession, getCurrentUser, logoutUser } from "./session";
import { isValidEmail } from "./validation";
import type { User } from "./storage/types";
import { users } from "./storage/dummy";

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

    if (!is_authenticated) {
        return Response.redirect("/login")
    }

    const data = {
        user: user,
        is_authenticated: is_authenticated
    };

    return render("./frontend/profile.html", data);
}

export async function login(req: Request) {
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    if (is_authenticated) {
        return Response.redirect("/")
    }

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

export async function signup(req: Request) {
    const user = getCurrentUser(req);
    const is_authenticated = user != undefined;

    if (is_authenticated) {
        return Response.redirect("/")
    }

    const data = {
        user: user,
        is_authenticated: is_authenticated,
        errors: [] as String[]
    };

    if (req.method == "POST") {
        const formData = await req.formData();

        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        const confirm_password = formData.get("confirm_password")?.toString() || "";

        if (name.length < 3) {
            data.errors.push("Name must contain more then 3 characters.");
        }

        if (email.length < 3) {
            data.errors.push("Email must contain more then 3 characters.");
        }
        if (!isValidEmail(email)) {
            data.errors.push("Email must be valid.");
        }

        if (password.length < 3 || confirm_password.length < 3) {
            data.errors.push("Password must contain more then 3 characters.");
        }
        if (confirm_password != password) {
            data.errors.push("Confirm Password and Password must match");
        }

        if (data.errors.length > 0) {
            return render("./frontend/signup.html", data);
        }

        const newUser: User = {
            name: name,
            email: email,
            orders: [],
            password: password
        }

        users.push(newUser);

        const sessionId = generateSessionId();
        setSession(sessionId, newUser);
        const response = new Response(null, {
            status: 302,
            headers: {
                'Set-Cookie': `sessionId=${sessionId};`,
                'Location': '/'
            }
        });
        return response;
    }

    return render("./frontend/signup.html", data);
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
    "/signup": signup,
    "/logout": logout,
    "/profile": profile,
};