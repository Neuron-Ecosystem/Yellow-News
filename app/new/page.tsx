'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImageToImgBB } from '@/lib/imgbb';
import Navbar from '@/components/layout/Navbar';

export default function NewNewsPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        sources: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSlugModal, setShowSlugModal] = useState(false);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (!loading && (!user || !userProfile?.isAdmin)) {
            router.push('/home');
        }
    }, [user, userProfile, loading, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.shortDesc || !formData.fullDesc) {
            setError('Заполните все обязательные поля');
            return;
        }

        setShowSlugModal(true);
    };

    const handlePublish = async () => {
        if (!slug) {
            setError('Введите URL новости');
            return;
        }

        // Validate slug format
        const slugRegex = /^[a-zA-Z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            setError('URL может содержать только латинские буквы, цифры и дефисы');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Check if slug already exists
            const slugQuery = query(collection(db, 'news'), where('slug', '==', slug));
            const slugSnapshot = await getDocs(slugQuery);

            if (!slugSnapshot.empty) {
                setError('Новость с таким URL уже существует');
                setSubmitting(false);
                return;
            }

            // Upload image if provided
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            // Create news document
            const newsData = {
                slug,
                title: formData.title,
                shortDesc: formData.shortDesc,
                fullDesc: formData.fullDesc,
                sources: formData.sources,
                imageUrl,
                authorId: user!.uid,
                timestamp: Date.now(),
            };

            await setDoc(doc(db, 'news', slug), newsData);

            // Redirect to the new article
            router.push(`/${slug}`);
        } catch (err: any) {
            console.error('Error publishing news:', err);
            setError(err.message || 'Ошибка публикации новости');
            setSubmitting(false);
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
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            <main className="container-custom py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-yellow-primary mb-8">Создание новости</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Заголовок новости <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            placeholder="Введите заголовок новости"
                            required
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Краткое описание <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.shortDesc}
                            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                            className="input-field resize-none"
                            rows={3}
                            placeholder="Введите краткое описание новости (2-4 строки)"
                            required
                        />
                    </div>

                    {/* Full Description */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Полное описание <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-400 mb-2">
                            💡 Для вставки изображений в текст используйте: <code className="bg-dark-border px-2 py-1 rounded text-yellow-primary">[IMG:URL]</code>
                            <br />
                            Пример: <code className="bg-dark-border px-2 py-1 rounded text-xs">Шаг 1: Откройте настройки [IMG:https://i.ibb.co/example.jpg] Шаг 2: Нажмите кнопку</code>
                        </p>
                        <textarea
                            value={formData.fullDesc}
                            onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                            className="input-field resize-none"
                            rows={12}
                            placeholder="Введите полное описание новости. Для вставки изображений используйте [IMG:URL]"
                            required
                        />
                    </div>

                    {/* Sources */}
                    <div>
                        <label className="block text-white font-medium mb-2">Источники</label>
                        <textarea
                            value={formData.sources}
                            onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                            className="input-field resize-none"
                            rows={3}
                            placeholder="Введите URL источников (каждый с новой строки или через запятую)"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-white font-medium mb-2">Изображение</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input-field"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-md rounded-lg border border-dark-border"
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={submitting}>
                        {submitting ? 'Публикация...' : 'Опубликовать'}
                    </button>
                </form>
            </main>

            {/* Slug Modal */}
            {showSlugModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
                    <div className="card max-w-md w-full">
                        <h2 className="text-2xl font-bold text-yellow-primary mb-4">Введите URL новости</h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            URL будет использоваться в адресе страницы. Используйте только латинские буквы, цифры и дефисы.
                        </p>

                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase())}
                            className="input-field mb-4"
                            placeholder="ai-in-news"
                            autoFocus
                        />

                        <div className="text-sm text-gray-500 mb-6">
                            Новость будет доступна по адресу: <span className="text-yellow-primary">/{slug || 'your-url'}</span>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    setShowSlugModal(false);
                                    setSlug('');
                                }}
                                className="btn-secondary flex-1"
                                disabled={submitting}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handlePublish}
                                className="btn-primary flex-1"
                                disabled={submitting || !slug}
                            >
                                {submitting ? 'Публикация...' : 'Опубликовать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
