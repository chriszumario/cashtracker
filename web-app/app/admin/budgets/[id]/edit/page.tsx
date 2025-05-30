import { Metadata } from "next"
import Link from "next/link"
import EditBudgetForm from "@/components/budgets/EditBudgetForm"
import { getBudget } from "@/src/services/budgets"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const budget = await getBudget(id)
  return {
    title: `CashTracker - ${budget.name}`,
    description: `CashTracker - ${budget.name}`,
  }
}

export default async function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const budget = await getBudget(id)

  return (
    <>
      <Link href={'/admin'} className='text-amber-500 font-semibold flex items-center mb-6'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75l-6-6m0 0l6-6m-6 6h18" />
        </svg>
        Volver al panel
      </Link>
      <h1 className='font-black text-3xl text-purple-950 mb-2'>
        Editar Presupuesto: {budget.name}
      </h1>
      <p className="text-lg text-gray-600 mb-8">Modifica los campos del presupuesto existente</p>
      <div className='p-6 md:p-8 mt-6 shadow-lg border rounded-lg'>
        <EditBudgetForm
          budget={budget}
        />
      </div>
    </>
  )
}
