import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://college-predictor-backend-jlrqmu9rk-nk112233s-projects.vercel.app',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  plugins: [react()],
});
