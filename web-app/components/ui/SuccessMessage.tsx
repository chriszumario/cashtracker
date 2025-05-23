export default function SuccessMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 my-3 p-2 border-l-4 border-green-400 text-green-800 bg-green-50 rounded shadow-sm animate-fade-in">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-sm font-semibold leading-snug">{children}</span>
        </div>
    )
}