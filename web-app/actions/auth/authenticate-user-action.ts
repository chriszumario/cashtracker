"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { parse, safeParse } from 'valibot'
import { ErrorResponseSchema, LoginSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
}

export async function authenticate(prevState: ActionStateType, formData: FormData) {
    const loginCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    const auth = safeParse(LoginSchema, loginCredentials)
    if (!auth.success) {
        return {
            errors: auth.issues.map(issue => issue.message)
        }
    }

    const url = `${process.env.API_URL}/auth/login`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: auth.output.password,
            email: auth.output.email
        })
    })

    const json = await req.json()
    if (!req.ok) {
        const { error } = parse(ErrorResponseSchema, json)
        return {
            errors: [error]
        }
    }

    // Setear Cookies
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'CASHTRACKER_TOKEN',
        value: json.token,
        httpOnly: true,
        path: '/'
    })

    redirect('/admin')
}