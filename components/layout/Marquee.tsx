'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MarqueeItem {
  title: string;
  slug: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
}

export default function Marquee({ items }: MarqueeProps) {
  const [duplicatedItems, setDuplicatedItems] = useState<MarqueeItem[]>([]);

  useEffect(() => {
    // Duplicate items for seamless loop
    setDuplicatedItems([...items, ...items, ...items]);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-yellow-primary text-black py-2 overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <Link
            key={index}
            href={`/${item.slug}`}
            className="inline-flex items-center mx-16 hover:underline cursor-pointer transition-all"
          >
            <span className="font-semibold">⚡</span>
            <span className="ml-2">{item.title}</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
