'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const { user, userProfile, signOut } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push('/home');
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center space-x-2 group">
                        <div className="text-2xl font-bold text-yellow-primary group-hover:scale-110 transition-transform">
                            Yellow News
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/home"
                            className="text-gray-300 hover:text-yellow-primary transition-colors font-medium"
                        >
                            Главная
                        </Link>

                        {user ? (
                            <>
                                <span className="text-gray-500 text-sm">{user.email}</span>

                                {userProfile?.isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="btn-secondary text-sm py-2 px-4"
                                    >
                                        Админ-панель
                                    </Link>
                                )}

                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-300 hover:text-red-400 transition-colors font-medium"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-yellow-primary transition-colors font-medium"
                                >
                                    Вход
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary text-sm py-2 px-4"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
