"use server"
import { parse, safeParse } from "valibot"
import { ErrorResponseSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function resetPassword(token: string, prevState: ActionStateType, formData: FormData) {

    const resetPasswordInput = {
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation'),
    }

    const resetPassword = safeParse(ResetPasswordSchema, resetPasswordInput)
    if (!resetPassword.success) {
        return {
            errors: resetPassword.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/reset-password/${token}`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: resetPasswordInput.password
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
    return {
        errors: [],
        success
    }
}