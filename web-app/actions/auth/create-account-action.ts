'use server'
import { parse, safeParse } from 'valibot';
import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
    success: string
}

export const register = async (prevState: ActionStateType, formData: FormData) => {
    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation'),
    }

    const register = safeParse(RegisterSchema, registerData)

    if (!register.success) {
        const errors = register.issues.map(issue => issue.message)
        return {
            errors,
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/create-account`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: register.output.name,
            password: register.output.password,
            email: register.output.email
        })
    })


    const json = await req.json()
    if (req.status === 409) {
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