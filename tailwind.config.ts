import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                yellow: {
                    primary: '#FFD700',
                    dark: '#FFC700',
                    light: '#FFE44D',
                },
                dark: {
                    bg: '#0A0A0A',
                    card: '#1A1A1A',
                    border: '#2A2A2A',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
