import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize for Replit deployment
  server: {
    host: '0.0.0.0',
    port: 3001,
    hmr: {
      // Use websocket for Replit
      clientPort: 443,
    },
  },
  // Optimize build output
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Reduce chunk size
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/storage', 'firebase/auth'],
        },
      },
    },
  },
}); 