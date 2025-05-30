import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useActionState, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense } from "@/src/schemas";
import editExpense from "@/actions/expense/edit-expense-action";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {
  const [expense, setExpense] = useState<DraftExpense>()
  const { id: budgetId } = useParams() as { id: string }
  const searchParams = useSearchParams()
  const expenseId = searchParams.get('editExpenseId')!

  const editExpenseWithBudgetId = editExpense.bind(null, {
    budgetId: +budgetId,
    expenseId: +expenseId
  })
  const [state, formAction] = useActionState(editExpenseWithBudgetId, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`
    fetch(url)
      .then(res => res.json())
      .then(data => setExpense(data))
  }, [budgetId, expenseId])

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
        Editar Gasto
      </DialogTitle>
      <p className="text-lg font-semibold mb-6">Edita los detalles de un {''}
        <span className="text-amber-500">Gasto...</span>
      </p>

      {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-6 mt-6 border"
        noValidate
        action={formAction}
      >
        <ExpenseForm
          expense={expense}
        />
        <input
          type="submit"
          className="bg-amber-500 w-full px-4 py-2 text-white font-semibold hover:bg-amber-600 cursor-pointer transition-colors rounded-lg text-base mt-4"
          value='Guardar Cambios'
        />
      </form>
    </>
  )
}