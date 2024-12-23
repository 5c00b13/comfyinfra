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
        target: process.env.VITE_COOLIFY_URL || 'https://coolify.llmcool.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/coolify/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Log the outgoing request for debugging
            console.log('Proxying request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Log the response for debugging
            console.log('Received response:', proxyRes.statusCode);
          });
        },
      },
    },
  },
});
