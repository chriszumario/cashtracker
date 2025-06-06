import { cache } from "react"
import getToken from "../auth/token"
import { notFound } from "next/navigation"
import { BudgetAPIResponseSchema } from "../schemas"
import { parse } from "valibot"

export const getBudget = cache(async (budgetId: string) => {
    const token = await getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}`
    const req = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const json = await req.json()

    if (!req.ok) {
        notFound()
    }

    const budget = parse(BudgetAPIResponseSchema, json)
    return budget
})