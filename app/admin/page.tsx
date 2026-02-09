'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is logged in
        if (!userProfile) {
            setError('Необходимо войти в систему');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }

        // Check if user is admin
        if (!userProfile.isAdmin) {
            setError('У вас нет прав администратора');
            setTimeout(() => router.push('/home'), 2000);
            return;
        }

        // Simple password check (you can customize this)
        if (password === 'admin123') {
            router.push('/new');
        } else {
            setError('Неверный пароль');
            setPassword('');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="text-yellow-primary text-xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
            <div className="card max-w-md w-full fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-yellow-primary mb-2">Админ-панель</h1>
                    <p className="text-gray-400">Введите пароль для доступа</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                    >
                        Войти
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/home')}
                        className="text-gray-400 hover:text-yellow-primary transition-colors"
                    >
                        ← Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
}
