"use client"
import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { User } from '@/src/schemas'
import { logout } from '@/actions/auth/logout-user-action'

type AdminMenuProps = {
    user: User
}

export default function AdminMenu({ user }: AdminMenuProps) {
    const menuItems = [
        {
            name: 'Mi Perfil',
            href: '/admin/profile/settings',
            icon: <UserCircleIcon className="w-5 h-5" />
        },
        {
            name: 'Mis Presupuestos',
            href: '/admin',
            icon: <ChartBarIcon className="w-5 h-5" />
        },
    ]

    return (
        <Popover className="relative">
            <PopoverButton
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                aria-label="Menú de usuario"
            >
                <Bars3Icon className='w-4 h-4' />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
            >
                <PopoverPanel className="absolute right-0 z-50 mt-2 w-64" >
                    {({ close }) => (
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                            <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-white shadow-inner">
                                        {user.name ? (
                                            <span className="text-base font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                        ) : (
                                            <UserCircleIcon className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="text-white">
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs opacity-90">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                                        onClick={() => close()}
                                    >
                                        <span className="text-gray-500 hover:text-teal-600">
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                <button
                                    onClick={async () => {
                                        close();
                                        await logout();
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:translate-x-1"
                                    type="button"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}