"use client"

import { updatePassword } from "@/actions/auth/update-password-action"
import ErrorMessage from "../ui/ErrorMessage"
import { useActionState, useEffect, useRef } from "react"
import { toast } from "react-toastify"

export default function ChangePasswordForm() {

  const ref = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(updatePassword, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      ref.current?.reset()
    }
  }, [state])

  return (
    <>
      <form
        className=" mt-8 space-y-4"
        noValidate
        action={formAction}
        ref={ref}
      >
        {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}

        <div className="flex flex-col gap-1">
          <label
            className="font-semibold text-sm"
            htmlFor="current_password"
          >Password Actual</label>
          <input
            id="current_password"
            type="password"
            placeholder="Password Actual"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            name="current_password"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="font-semibold text-sm"
            htmlFor="password"
          >Nuevo Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="font-semibold text-sm"
            htmlFor="password_confirmation"
          >Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            name="password_confirmation"
          />
        </div>

        <input
          type="submit"
          value='Cambiar Password'
          className="bg-purple-950 hover:bg-purple-800 w-full px-4 py-2 rounded-lg text-white font-semibold text-base cursor-pointer transition-colors mt-6"
        />
      </form>
    </>
  )
}