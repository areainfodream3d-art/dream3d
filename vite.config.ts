import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['www.dream-3d.com', 'dream-3d.com'],
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: ['www.dream-3d.com', 'dream-3d.com'],
  },
  plugins: [react()],
});
