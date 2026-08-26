import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_BACKEND_SERVER_URL || 'http://127.0.0.1:80';
  const coreTarget = env.VITE_CORE_SERVER_URL || 'http://127.0.0.1:80';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/manufacturer': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/core': {
          target: coreTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});


