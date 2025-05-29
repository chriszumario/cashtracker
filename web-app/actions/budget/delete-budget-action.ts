"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { Budget, ErrorResponseSchema, PasswordValidationSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function deleteBudget(budgetId: Budget['id'], prevState: ActionStateType, formData: FormData) {
    const currentPassword = safeParse(PasswordValidationSchema, formData.get('password'))
    if (!currentPassword.success) {
        return {
            errors: currentPassword.issues.map(issue => issue.message),
            success: ''
        }
    }

    // Comprobar password
    const token = await getToken()
    const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`
    const checkPasswordReq = await fetch(checkPasswordUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: currentPassword.output
        })
    })

    const checkPasswordJson = await checkPasswordReq.json()
    if (!checkPasswordReq.ok) {
        const { error } = parse(ErrorResponseSchema, checkPasswordJson)
        return {
            errors: [error],
            success: ''
        }
    }

    // Eliminar Presupuesto
    const deleteBudgetUrl = `${process.env.API_URL}/budgets/${budgetId}`
    const deleteBudgetReq = await fetch(deleteBudgetUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })

    const deleteBudgetJson = await deleteBudgetReq.json()

    if (!deleteBudgetReq.ok) {
        const { error } = parse(ErrorResponseSchema, deleteBudgetJson)
        return {
            errors: [error],
            success: ''
        }
    }

    revalidatePath('/admin')
    const success = parse(SuccessSchema, deleteBudgetJson)
    return {
        errors: [],
        success
    }
}