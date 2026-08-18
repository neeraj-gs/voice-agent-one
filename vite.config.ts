import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // The renderer, the charting library and the AI SDKs are each only
        // needed on some routes. Splitting them keeps the first paint on the
        // marketing page from carrying the whole app.
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          charts: ['recharts'],
          voice: ['@elevenlabs/react'],
          ai: ['openai'],
        },
      },
    },
  },
});
