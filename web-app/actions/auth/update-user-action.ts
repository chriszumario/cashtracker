"use server"
import { parse, safeParse } from "valibot"
import getToken from "@/src/auth/token"
import { ErrorResponseSchema, ProfileFormSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function updateUser(prevState: ActionStateType, formData: FormData) {

    const profile = safeParse(ProfileFormSchema, {
        name: formData.get('name'),
        email: formData.get('email')
    })
    if (!profile.success) {
        return {
            errors: profile.issues.map(issue => issue.message),
            success: ''
        }
    }

    const token = getToken()
    const url = `${process.env.API_URL}/auth/user`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: profile.output.name,
            email: profile.output.email,
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

    revalidatePath('/admin/profile/settings')
    const success = parse(SuccessSchema, json)
    return {
        errors: [],
        success
    }

}