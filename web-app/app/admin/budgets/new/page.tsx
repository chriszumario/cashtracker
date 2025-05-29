import CreateBudgetForm from "@/components/budgets/CreateBudgetForm";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';

export default function CreateBudgetPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver al panel
        </Link>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Presupuesto</h1>
          <p className="mt-1 text-sm text-gray-600">
            Completa los campos para crear un nuevo presupuesto
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-6">
          <CreateBudgetForm />
        </div>
      </div>
    </div>
  );
}