"use client"

import { updateUser } from "@/actions/auth/update-user-action"
import { User } from "@/src/schemas"
import ErrorMessage from "../ui/ErrorMessage"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"


export default function ProfileForm({ user }: { user: User }) {

  const [state, formAction] = useActionState(updateUser, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
    }
  }, [state])

  return (
    <>
      <form
        className=" mt-8 space-y-4"
        noValidate
        action={formAction}
      >
        {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
        <div className="flex flex-col gap-1">
          <label
            className="font-semibold text-sm"
          >Nombre</label>
          <input
            type="name"
            placeholder="Tu Nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            name="name"
            defaultValue={user.name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="font-semibold text-sm"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Tu Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            name="email"
            defaultValue={user.email}
          />
        </div>

        <input
          type="submit"
          value='Guardar Cambios'
          className="bg-purple-950 hover:bg-purple-800 w-full px-4 py-2 rounded-lg text-white font-semibold text-base cursor-pointer transition-colors mt-6"
        />
      </form>
    </>
  )
}