import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { DialogTitle } from "@headlessui/react"
import { deleteBudget } from "@/actions/budget/delete-budget-action"
import ErrorMessage from "../ui/ErrorMessage"
import { useActionState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"

export default function ConfirmPasswordForm() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const budgetId = +searchParams.get('deleteBudgetId')!

    const closeModal = useCallback(() => {
        const hideModal = new URLSearchParams(searchParams.toString())
        hideModal.delete('deleteBudgetId')
        router.replace(`${pathname}?${hideModal}`)
    }, [router, pathname, searchParams])

    const deleteBudgetWithPassword = deleteBudget.bind(null, budgetId)
    const [state, formAction] = useActionState(deleteBudgetWithPassword, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            closeModal()
        }
    }, [state, closeModal])



    return (
        <>
            <DialogTitle
                as="h3"
                className="font-bold text-2xl text-purple-950 mb-4"
            >
                Eliminar Presupuesto
            </DialogTitle>
            <p className="text-lg font-semibold mb-2">Ingresa tu Password para {''}
                <span className="text-amber-500">eliminar el presupuesto {''}</span>
            </p>
            <p className='text-gray-600 text-sm mb-6'>(Un presupuesto eliminado y sus gastos no se pueden recuperar)</p>

            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <form
                className=" mt-4 space-y-4"
                noValidate
                action={formAction}
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-semibold text-lg"
                        htmlFor="password"
                    >Ingresa tu Password para eliminar</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
                        name='password'
                    />
                </div>
                <div className="flex flex-col gap-3 mt-6">
                    <input
                        type="submit"
                        value='Eliminar Presupuesto'
                        className="bg-purple-950 hover:bg-purple-800 px-3 py-1.5 rounded-lg text-white font-semibold cursor-pointer transition-colors text-sm"
                    />
                    <button
                        className="bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg text-white font-semibold cursor-pointer transition-colors text-sm"
                        onClick={closeModal}
                    >Cancelar</button>
                </div>
            </form>

        </>
    )
}