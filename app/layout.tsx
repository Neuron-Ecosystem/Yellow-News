import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Yellow News - Честные новости без манипуляций",
    description: "Независимое новостное издание. Факты, контекст, понимание — без эмоций и кликбейта.",
    keywords: "новости, честные новости, независимые новости, Yellow News",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
