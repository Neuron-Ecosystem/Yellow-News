'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { uploadImageToImgBB } from '@/lib/imgbb';
import Navbar from '@/components/layout/Navbar';

export default function EditNewsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user, userProfile, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        sources: '',
    });
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || !userProfile?.isAdmin)) {
            router.push('/home');
        } else if (slug && userProfile?.isAdmin) {
            fetchArticle();
        }
    }, [slug, user, userProfile, authLoading, router]);

    const fetchArticle = async () => {
        try {
            const docRef = doc(db, 'news', slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    title: data.title,
                    shortDesc: data.shortDesc,
                    fullDesc: data.fullDesc,
                    sources: data.sources,
                });
                setCurrentImageUrl(data.imageUrl || '');
                setImagePreview(data.imageUrl || '');
            } else {
                router.push('/home');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

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

        setSubmitting(true);

        try {
            let imageUrl = currentImageUrl;

            // Upload new image if provided
            if (imageFile) {
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            // Update news document
            const newsData = {
                title: formData.title,
                shortDesc: formData.shortDesc,
                fullDesc: formData.fullDesc,
                sources: formData.sources,
                imageUrl,
            };

            await updateDoc(doc(db, 'news', slug), newsData);

            // Redirect to the article
            router.push(`/${slug}`);
        } catch (err: any) {
            console.error('Error updating news:', err);
            setError(err.message || 'Ошибка обновления новости');
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
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
                <h1 className="text-4xl font-bold text-yellow-primary mb-8">Редактирование новости</h1>

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
                        <textarea
                            value={formData.fullDesc}
                            onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                            className="input-field resize-none"
                            rows={12}
                            placeholder="Введите полное описание новости"
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

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => router.push(`/${slug}`)}
                            className="btn-secondary flex-1"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={submitting}
                        >
                            {submitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
