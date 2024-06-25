// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        secure: false, // Only needed if your backend server is using HTTPS with a self-signed certificate
        changeOrigin: true, // Add this line to handle cross-origin requests properly
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove this line if not necessary
      },
    },
  },
  plugins: [react()],
});
