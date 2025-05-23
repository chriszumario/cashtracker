"use server"

import { parse, safeParse } from "valibot"
import { ErrorResponseSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
    success: string
}


export async function forgotPassword(prevState: ActionStateType, formData: FormData) {

    const forgotPassword = safeParse(ForgotPasswordSchema, {
        email: formData.get('email')
    })

    if (!forgotPassword.success) {
        return {
            errors: forgotPassword.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/forgot-password`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: forgotPassword.output.email
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