export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 my-1 p-2 border-l-4 border-red-400 text-red-700 bg-red-50 rounded shadow-sm animate-fade-in">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
            <span className="text-sm font-medium leading-snug">{children}</span>
        </div>
    )
}