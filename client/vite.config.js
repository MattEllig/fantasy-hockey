import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
    server: {
        open: true,
    },
    plugins: [reactRefresh()],
});
