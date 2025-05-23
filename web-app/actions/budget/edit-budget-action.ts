"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { Budget, DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath, revalidateTag } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function editBudget(budgetId: Budget['id'], prevState: ActionStateType, formData: FormData) {

    const budgetData = {
        name: formData.get('name'),
        amount: formData.get('amount')
    }
    const budget = safeParse(DraftBudgetSchema, budgetData)
    if (!budget.success) {
        return {
            errors: budget.issues.map(issue => issue.message),
            success: ''
        }
    }

    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: budget.output.name,
            amount: budget.output.amount
        })
    })
    const json = await req.json()

    if (!req.ok) {
        const { error } = parse(ErrorResponseSchema, json)
        return {
            errors: [error],
            success: ''
        }
    }

    revalidatePath('/admin')

    const success = parse(SuccessSchema, json)
    return {
        errors: [],
        success
    }
}