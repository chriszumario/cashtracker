import ProgressBar from "@/components/budgets/ProgressBar"
import AddExpenseButton from "@/components/expenses/AddExpenseButton"
import ExpenseMenu from "@/components/expenses/ExpenseMenu"
import Amount from "@/components/ui/Amount"
import ModalContainer from "@/components/ui/ModalContainer"
import { getBudget } from "@/src/services/budgets"
import { formatCurrency, formatDate } from "@/src/utils"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params
    const budget = await getBudget(id)
    return {
        title: `CashTrackr - ${budget.name}`,
        description: `CashTrackr - ${budget.name}`,
    }
}

export default async function BudgetDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const budget = await getBudget(id)

    const totalSpent = budget.expenses.reduce((total, expense) => +expense.amount + total, 0)
    const totalAvailable = +budget.amount - totalSpent

    const percentage = +((totalSpent / +budget.amount) * 100).toFixed(2)

    return (
        <>
            <div className='flex flex-col md:flex-row md:justify-between items-center mb-6'>
                <div className="w-full md:w-auto">
                    <h1 className="font-black text-3xl text-purple-950 my-3">{budget.name}</h1>
                    <p className="text-lg font-semibold">Administra tus {''} <span className="text-amber-500">gastos</span></p>
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0">
                    <AddExpenseButton />
                </div>
            </div>

            {budget.expenses.length ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6">
                        <ProgressBar
                            percentage={percentage}
                        />
                        <div className="flex flex-col justify-center items-center md:items-start gap-3">
                            <Amount
                                label="Presupuesto"
                                amount={+budget.amount}
                            />
                            <Amount
                                label="Disponible"
                                amount={totalAvailable}
                            />
                            <Amount
                                label="Gastado"
                                amount={totalSpent}
                            />
                        </div>
                    </div>

                    <h1 className="font-black text-3xl text-purple-950 mt-8">
                        Gastos en este presupuesto
                    </h1>

                    <ul role="list" className="divide-y divide-gray-300 border shadow-lg mt-6 rounded-lg">
                        {budget.expenses.map((expense) => (
                            <li key={expense.id} className="flex justify-between items-center gap-x-4 py-3 px-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto space-y-2">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {expense.name}
                                        </p>
                                        <p className="text-xl font-bold text-amber-500">
                                            {formatCurrency(+expense.amount)}
                                        </p>
                                        <p className='text-gray-500  text-sm'>
                                            Agregado: {''}
                                            <span className="font-bold">{formatDate(expense.updatedAt)}</span>
                                        </p>
                                    </div>
                                </div>

                                <ExpenseMenu
                                    expenseId={expense.id}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className="text-center py-20">No hay gastos aún</p>
            )}
            <ModalContainer />
        </>
    )
}
