import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: '/project-quiz-frontend/',
    define: {
        // Cấu hình này giúp các thư viện cũ (như sockjs-client)
        // hiểu được biến global trong môi trường trình duyệt.
        global: 'window',
    },
})