export interface Product {
    price: number
    image: string
    name: string
    description: string
}

export type Products = Record<string, Product>;