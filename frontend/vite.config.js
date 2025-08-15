import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/templates': 'http://localhost:8000',
      '/documents': 'http://localhost:8000',
    },
  },
  test: {
    environment: 'jsdom',
  },
});
