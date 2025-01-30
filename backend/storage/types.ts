export interface Product {
    price: number
    image: string
    name: string
    description: string
}

export interface OrderItem {
    user: User
    item: Product
    quanity: number
    total_price: number
}

export interface Order {
    user: User
    items: OrderItem[]
    total_price: number
    address: string
}

export interface User {
    name: string
    password: string
    email: string
    orders: Order[]
}

export type Products = Record<string, Product>;