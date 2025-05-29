import { Budget } from "@/src/schemas";
import { DollarSign, Tag } from 'lucide-react';

export default function BudgetForm({ budget }: { budget?: Budget }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Presupuesto
        </label>
        <div className="relative rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="name"
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            type="text"
            placeholder="Ej: Ahorros 2023"
            name="name"
            defaultValue={budget?.name}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad
        </label>
        <div className="relative rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="number"
            id="amount"
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="0.00"
            name="amount"
            step="0.01"
            min="0"
            defaultValue={budget?.amount}
            required
          />
        </div>
      </div>
    </div>
  );
}
