"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export default async function createExpense(budgetId: number, prevState: ActionStateType, formData: FormData) {
    const expenseData = {
        name: formData.get('name'),
        amount: formData.get('amount')
    }
    const expense = safeParse(DraftExpenseSchema, expenseData)
    if (!expense.success) {
        return {
            errors: expense.issues.map(issue => issue.message),
            success: ''
        }
    }

    // Generar gasto
    const token = await getToken()
    console.log(token)
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: expense.output.name,
            amount: expense.output.amount
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

    const success = parse(SuccessSchema, json)
    revalidatePath(`/admin/budgets/${budgetId}`)

    return {
        errors: [],
        success
    }
}