import type { Products, User } from "../types";

export const products: Products = {
    "bananas": {
        price: 10,
        image: "https://raw.githubusercontent.com/ajh123/ua92-ecommerce/refs/heads/main/docs/demo/images/bannanas.jpg",
        name: "Bananas",
        description: "Yellow or green."
    },
    "bread": {
        price: 10,
        image: "https://raw.githubusercontent.com/ajh123/ua92-ecommerce/refs/heads/main/docs/demo/images/bread.jpg",
        name: "Bread",
        description: "DOUGH!"
    },
    "chicken": {
        price: 10,
        image: "https://raw.githubusercontent.com/ajh123/ua92-ecommerce/refs/heads/main/docs/demo/images/chicken.jpg",
        name: "Chicken",
        description: "Plates not included."
    },
    "eggs": {
        price: 10,
        image: "https://raw.githubusercontent.com/ajh123/ua92-ecommerce/refs/heads/main/docs/demo/images/eggs.jpg",
        name: "Eggs",
        description: "Broken eggs or basket not included."
    }
}

export const users: User[] = [
    {
        email: "bob@example.com",
        name: "Bob",
        orders: [],
        password: "secretKey"
    }
]