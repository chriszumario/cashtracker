import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import createExpense from "@/actions/expense/create-expense-action";
import { useParams } from "next/navigation";
import ErrorMessage from "../ui/ErrorMessage";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddExpenseForm({ closeModal }: { closeModal: () => void }) {
    const { id } = useParams()
    if (!id) throw new Error('Budget ID is required')
    const createExpenseWithBudgetId = createExpense.bind(null, +id)
    const [state, formAction] = useActionState(createExpenseWithBudgetId, {
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
                className="font-black text-xl md:text-2xl my-2 text-center bg-gradient-to-r from-purple-900 to-amber-500 bg-clip-text text-transparent"
            >
                Agregar Gasto
            </DialogTitle>

            <p className="text-sm md:text-base font-medium text-gray-600 text-center mb-3">
                Llena el formulario y crea un {''}
                <span className="text-amber-500 font-bold">gasto</span>
            </p>

            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <form
                className="bg-white rounded-lg w-full"
                noValidate
                action={formAction}
            >
                <div className="space-y-3">
                    <ExpenseForm />
                </div>

                <input
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 w-full p-2 md:p-2.5 text-white uppercase font-bold hover:from-amber-600 hover:to-amber-700 cursor-pointer transition-all duration-300 rounded-md mt-4 text-sm shadow hover:shadow-md transform hover:-translate-y-0.5"
                    value='Registrar Gasto'
                />
            </form>
        </>
    )
}