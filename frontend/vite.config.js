import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * En desarrollo, las peticiones del front a `/api/*` se reenvían al servidor Express
 * (por defecto localhost:4000), así el navegador no mezcla orígenes ni requiere CORS extra.
 */
export default defineConfig({
  root: rootDir,
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
