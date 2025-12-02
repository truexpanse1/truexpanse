import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      // This alias tells Vite that any import starting with '@/components' 
      // should look in the 'src/components' directory.
      '@/components': path.resolve(__dirname, './src/components'),
    },
  },
});
