"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { DraftBudgetSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function createBudget(prevState: ActionStateType, formData: FormData) {

    const budget = safeParse(DraftBudgetSchema, {
        name: formData.get('name'),
        amount: formData.get('amount')
    })
    if (!budget.success) {
        return {
            errors: budget.issues.map(issue => issue.message),
            success: ''
        }
    }

    const token = await getToken()
    const url = `${process.env.API_URL}/budgets`

    const req = await fetch(url, {
        method: 'POST',
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

    revalidatePath('/admin')
    const success = parse(SuccessSchema, json)
    return {
        errors: [],
        success
    }
}