import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_SHOPKEEPER_SERVER_URL || 'http://127.0.0.1:80';

  return {
    plugins: [react()],
    server: {
      port: 5175,
      host: true,
      proxy: {
        '/api/shopkeeper': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/medicine': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/v1': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
