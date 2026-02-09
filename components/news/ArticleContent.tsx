'use client';

import Image from 'next/image';

interface ArticleContentProps {
    content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
    // Parse content and replace [IMG:url] with actual images
    const parseContent = (text: string) => {
        const parts: (string | JSX.Element)[] = [];
        const regex = /\[IMG:(https?:\/\/[^\]]+)\]/g;
        let lastIndex = 0;
        let match;
        let keyCounter = 0;

        while ((match = regex.exec(text)) !== null) {
            // Add text before the image
            if (match.index > lastIndex) {
                const textBefore = text.substring(lastIndex, match.index);
                parts.push(textBefore);
            }

            // Add the image
            const imageUrl = match[1];
            parts.push(
                <div key={`img-${keyCounter++}`} className="my-6 rounded-xl overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Article image"
                        className="w-full h-auto rounded-xl"
                        loading="lazy"
                    />
                </div>
            );

            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts;
    };

    const parsedContent = parseContent(content);

    return (
        <div className="prose prose-invert max-w-none mb-12">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {parsedContent.map((part, index) => {
                    if (typeof part === 'string') {
                        return <span key={`text-${index}`}>{part}</span>;
                    }
                    return part;
                })}
            </div>
        </div>
    );
}
