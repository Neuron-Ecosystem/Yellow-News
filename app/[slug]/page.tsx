'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { NewsArticle, Comment } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArticleContent from '@/components/news/ArticleContent';
import Image from 'next/image';

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user, userProfile } = useAuth();

    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchArticle();
            fetchComments();
        }
    }, [slug]);

    const fetchArticle = async () => {
        try {
            const docRef = doc(db, 'news', slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setArticle({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
            } else {
                router.push('/home');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsQuery = query(
                collection(db, 'news', slug, 'comments'),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(commentsQuery);
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Comment[];
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmittingComment(true);

        try {
            const commentData = {
                newsId: slug,
                userId: user.uid,
                userEmail: user.email || 'Anonymous',
                text: newComment,
                timestamp: Date.now(),
            };

            await addDoc(collection(db, 'news', slug, 'comments'), commentData);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;

        try {
            await deleteDoc(doc(db, 'news', slug));
            router.push('/home');
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Ошибка при удалении новости');
        }
    };

    const handleEdit = () => {
        router.push(`/edit/${slug}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="text-yellow-primary text-xl">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-400 text-xl">Новость не найдена</div>
                </div>
            </div>
        );
    }

    const sources = article.sources
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // Helper function to ensure URL has protocol
    const ensureProtocol = (url: string): string => {
        if (!url.match(/^https?:\/\//i)) {
            return `http://${url}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            <main className="container-custom py-12 max-w-4xl">
                {/* Admin Controls */}
                {userProfile?.isAdmin && (
                    <div className="flex space-x-4 mb-6">
                        <button onClick={handleEdit} className="btn-secondary text-sm py-2 px-4">
                            ✏️ Редактировать
                        </button>
                        <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-sm font-medium">
                            🗑️ Удалить
                        </button>
                    </div>
                )}

                {/* Article Header */}
                <article className="fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="text-gray-400 mb-8">
                        {new Date(article.timestamp).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>

                    {/* Image */}
                    {article.imageUrl && (
                        <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Short Description */}
                    <div className="text-xl text-gray-300 mb-8 leading-relaxed border-l-4 border-yellow-primary pl-6">
                        {article.shortDesc}
                    </div>

                    {/* Full Description with inline images */}
                    <div className="prose prose-invert max-w-none mb-12">
                        <ArticleContent content={article.fullDesc} />
                    </div>

                    {/* Sources */}
                    {sources.length > 0 && (
                        <div className="card mb-12">
                            <h3 className="text-xl font-bold text-yellow-primary mb-4">Источники</h3>
                            <ul className="space-y-2">
                                {sources.map((source, index) => (
                                    <li key={index}>
                                        <a
                                            href={ensureProtocol(source)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 hover:underline break-all inline-flex items-center gap-1"
                                        >
                                            <span>{source}</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </article>

                {/* Comments Section */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Комментарии ({comments.length})
                    </h2>

                    {/* Add Comment Form */}
                    {user ? (
                        <form onSubmit={handleAddComment} className="card mb-8">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="input-field resize-none mb-4"
                                rows={4}
                                placeholder="Написать комментарий..."
                                required
                            />
                            <button
                                type="submit"
                                disabled={submittingComment || !newComment.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingComment ? 'Отправка...' : 'Отправить комментарий'}
                            </button>
                        </form>
                    ) : (
                        <div className="card mb-8 text-center">
                            <p className="text-gray-400">
                                <a href="/login" className="text-yellow-primary hover:underline">
                                    Войдите
                                </a>
                                , чтобы оставить комментарий
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Комментариев пока нет</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="card">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="font-semibold text-yellow-primary">
                                            {comment.userEmail}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.timestamp).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap">{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
