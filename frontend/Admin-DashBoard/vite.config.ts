import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adminBackendTarget = env.VITE_BACKEND_SERVER_URL || env.VITE_API_BASE_URL || 'http://127.0.0.1:80';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5174,
      host: true,
      proxy: {
        '/api/admin': {
          target: adminBackendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
