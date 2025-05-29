import { DraftExpense } from "@/src/schemas"

type ExpenseFormProps = {
    expense?: DraftExpense
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
    return (
        <>
            <div className="mb-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-semibold">
                        Nombre Gasto
                    </label>
                    <input
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        type="text"
                        placeholder="Nombre del Gasto"
                        name="name"
                        defaultValue={expense?.name}
                    />
                </div>
            </div>

            <div className="mb-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="amount" className="text-sm font-semibold">
                        Cantidad Gasto
                    </label>
                    <input
                        id="amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        type="number"
                        placeholder="Cantidad Gasto"
                        name="amount"
                        defaultValue={expense?.amount}
                    />
                </div>
            </div>
        </>
    )
}