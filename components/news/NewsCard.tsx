'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/lib/types';
import { motion } from 'framer-motion';

interface NewsCardProps {
    article: NewsArticle;
    index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/${article.slug}`}>
                <div className="card group cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-dark-border">
                        {article.imageUrl ? (
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <span className="text-4xl">📰</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-primary transition-colors line-clamp-2">
                            {article.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                            {article.shortDesc}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-dark-border">
                            <span>
                                {new Date(article.timestamp).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <span className="text-yellow-primary group-hover:underline">
                                Читать далее →
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
