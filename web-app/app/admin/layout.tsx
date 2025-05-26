import AdminMenu from "@/components/admin/AdminMenu";
import Logo from "@/components/ui/Logo";
import ToastNotification from "@/components/ui/ToastNotification";
import { verifySession } from "@/src/auth/dal";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = await verifySession()

    return (
        <>
            <header className='bg-gradient-to-r from-teal-700 to-emerald-800 py-3 shadow-md'>
                <div className='max-w-5xl mx-auto px-4 flex flex-row justify-between items-center'>
                    <div className='w-40'>
                        <Link href={'/admin'}>
                            <Logo />
                        </Link>
                    </div>

                    <AdminMenu
                        user={user}
                    />
                </div>
            </header>
            <section className='max-w-5xl mx-auto mt-5 p-3 py-10'>
                {children}
            </section>

            <ToastNotification />

            <footer className='py-5'>
                <p className='text-center'>
                    Todos los Derechos Reservados {new Date().getFullYear()}
                </p>
            </footer>
        </>
    );
}