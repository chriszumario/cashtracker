"use client"
import { authenticate } from "@/actions/auth/authenticate-user-action"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"

export default function LoginForm() {

    const [state, formAction, pending] = useActionState(authenticate, {
        errors: []
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
    }, [state])

    return (
        <>
            <form
                action={formAction}
                className="mt-10 space-y-5"
                noValidate
            >
                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-xl"
                    >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="email"
                        defaultValue="test@test.com" // Añadir valor por defecto para el email
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-xl"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="password"
                        defaultValue="password123" // Añadir valor por defecto para la contraseña
                    />
                </div>

                <input
                    type="submit"
                    value='Iniciar Sesión'
                    className="bg-purple-950 hover:bg-purple-800 w-full p-2 rounded-lg text-white font-black  text-xl cursor-pointer block disabled:opacity-50 disabled:cursor-progress"
                    disabled={pending}
                />
            </form>
        </>
    )
}