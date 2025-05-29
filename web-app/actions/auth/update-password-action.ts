"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { ErrorResponseSchema, SuccessSchema, UpdatePasswordSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function updatePassword(prevState: ActionStateType, formData: FormData) {

    const userPassword = safeParse(UpdatePasswordSchema, {
        current_password: formData.get('current_password'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation'),
    })

    if (!userPassword.success) {
        return {
            errors: userPassword.issues.map(issue => issue.message),
            success: ''
        }
    }

    const token = await getToken()
    const url = `${process.env.API_URL}/auth/update-password`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: userPassword.output.current_password,
            password: userPassword.output.password
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