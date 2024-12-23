import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/coolify': {
          target: env.VITE_COOLIFY_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          ws: true,
          xfwd: true,
          rewrite: (path) => path.replace(/^\/api\/coolify/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('X-Forwarded-Host', req.headers.host || '');
              proxyReq.setHeader('X-Forwarded-Proto', 'https');
              // Add CORS headers
              proxyReq.setHeader('Access-Control-Allow-Origin', '*');
              proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            });
          },
        },
        '/api/claude': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/claude/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Claude Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              proxyReq.setHeader('x-api-key', env.VITE_CLAUDE_API_KEY);
              proxyReq.setHeader('anthropic-version', '2024-02-29');
              proxyReq.setHeader('Content-Type', 'application/json');
            });
          }
        }
      },
      cors: true // Enable CORS for development
    },
  };
});
