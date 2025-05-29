"use client"
import { createBudget } from "@/actions/budget/create-budget-action"
import { useActionState, useState } from "react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import BudgetForm from "./BudgetForm"
import { Loader2, Plus } from 'lucide-react';

export default function CreateBudgetForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [state, formAction] = useActionState(createBudget, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.success) {
            toast.success(state.success, {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            router.push('/admin')
        } else if (state.errors && state.errors.length > 0) {
            setIsSubmitting(false);
        }
    }, [state, router])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formAction(formData);
    };

    return (
        <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit}
        >
            {state.errors && state.errors.length > 0 && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">
                    <ul className="list-disc pl-5 space-y-1">
                        {state.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <BudgetForm />
            
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Crear Presupuesto
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}