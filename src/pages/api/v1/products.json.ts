import type { APIRoute } from "astro"
import { products } from "../../../backend/storage/dummy"

export const GET: APIRoute = async (ctx) => {
    return new Response(
        JSON.stringify(products)
    )
}