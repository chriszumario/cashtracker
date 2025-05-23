"use server"
import { parse, safeParse } from "valibot"
import { ErrorResponseSchema, SuccessSchema, TokenSchema } from "@/src/schemas"



type ActionStateType = {
    errors: string[]
    success: string
}

export async function confirmAccount(token: string, prevState: ActionStateType) {

    const confirmToken = safeParse(TokenSchema, token)
    if (!confirmToken.success) {
        return {
            errors: confirmToken.issues.map(issue => issue.message),
            success: ''
        }
    }

    // confirmar el usuario
    const url = `${process.env.API_URL}/auth/confirm-account`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: confirmToken.output
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