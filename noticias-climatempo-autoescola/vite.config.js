import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/blog-climatempo-noticias', // Com domínio próprio, usar '/' como base
    plugins: [react()],
    server: {
        hmr: {
            overlay: false, // Disables the error overlay
        },
    }
});


