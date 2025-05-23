import ToastNotification from "@/components/ui/ToastNotification";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-amber-50 p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 m-4 border border-gray-100">
                    {children}
                </div>
                <ToastNotification />
            </div>
        </>
    );
}