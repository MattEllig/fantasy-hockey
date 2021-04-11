import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
    server: {
        open: true,
        proxy: {
            '/api': `http://localhost:${process.env.PORT || 5000}`,
        },
    },
    plugins: [
        eslintPlugin({ include: 'src/**/*.{ts,tsx}' }),
        reactRefresh(),
    ],
});
