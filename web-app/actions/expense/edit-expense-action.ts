"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { Budget, DraftExpenseSchema, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type BudgetAndExpenseIdType = {
    budgetId: Budget['id']
    expenseId: Expense['id']
}

type ActionStateType = {
    errors: string[]
    success: string
}

export default async function editExpense(
    { budgetId, expenseId }: BudgetAndExpenseIdType,
    prevState: ActionStateType,
    formData: FormData
) {

    const expense = safeParse(DraftExpenseSchema, {
        name: formData.get('name'),
        amount: formData.get('amount')
    })
    if (!expense.success) {
        return {
            errors: expense.issues.map(issue => issue.message),
            success: ''
        }
    }

    // Actualizar el gasto
    const token = await getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: expense.output.name,
            amount: expense.output.amount,
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