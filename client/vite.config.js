import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
    server: {
        open: true,
    },
    plugins: [
        eslintPlugin({ include: 'src/**/*.{js,jsx}' }),
        reactRefresh()
    ],
});
