import { products } from "./dummy";
import type { Product, Products } from "./types";

export function getProductById(id: string): Product {
    return products[id];
}

export function getProducts(): Products {
    return products;
}