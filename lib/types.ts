export interface NewsArticle {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    sources: string;
    imageUrl: string;
    authorId: string;
    timestamp: number;
}

export interface User {
    uid: string;
    email: string;
    isAdmin: boolean;
}

export interface Comment {
    id: string;
    newsId: string;
    userId: string;
    userEmail: string;
    text: string;
    timestamp: number;
}
