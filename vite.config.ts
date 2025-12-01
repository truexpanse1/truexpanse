import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // fixed to point to src (standard)
    },
  },
  // THIS FIX KILLS THE "process.env.PATH" WARNING FOREVER
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // Add any other env vars you actually use below if needed:
    // 'process.env.VITE_SUPABASE_URL': JSON.stringify(import.meta.env.VITE_SUPABASE_URL),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
