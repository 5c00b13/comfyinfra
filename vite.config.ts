import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/coolify': {
        target: process.env.VITE_COOLIFY_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coolify/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Remove CORS headers from proxy request
            proxyReq.removeHeader('Origin');
            proxyReq.removeHeader('Referer');
          });
        },
      },
    },
  },
});
