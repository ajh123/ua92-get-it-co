import { products, users } from "./dummy";
import type { Product, Products, User } from "./types";

export function getProductById(id: string): Product {
    return products[id];
}

export function getProducts(): Products {
    return products;
}

export function getUser(email: string): User | undefined {
    for (const user of users) {
        if (user.email == email) {
            return user;
        }
    }

    return undefined;
}

export function authenticate(user: User, testPass: string): boolean {
    if (user.password == testPass) {
        return true;
    }
    return false;
}