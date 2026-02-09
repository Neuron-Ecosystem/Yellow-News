'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import NewsCard from '@/components/news/NewsCard';

export default function HomePage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [marqueeItems, setMarqueeItems] = useState<Array<{ title: string; slug: string }>>([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const newsQuery = query(
                collection(db, 'news'),
                orderBy('timestamp', 'desc'),
                limit(20)
            );

            const snapshot = await getDocs(newsQuery);
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsArticle[];

            setNews(newsData);

            // Create marquee items from latest 5 news with title and slug
            const latestNews = newsData.slice(0, 5).map(article => ({
                title: article.title,
                slug: article.slug
            }));
            setMarqueeItems(latestNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />
            <Marquee items={marqueeItems} />

            <main className="container-custom py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 fade-in">
                        Последние новости
                    </h1>
                    <p className="text-gray-400 text-lg fade-in">
                        Честные, нейтральные и проверяемые новости без манипуляций
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-yellow-primary text-xl">Загрузка новостей...</div>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">Новостей пока нет</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((article, index) => (
                            <NewsCard key={article.id} article={article} index={index} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
