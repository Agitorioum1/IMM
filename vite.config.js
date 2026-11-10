import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Menjalankan API (server/app.js) di dalam server Vite, jadi `npm run dev` / `npm run preview`
// sudah termasuk backend. Di Vercel, API berjalan lewat api/index.js.
function api() {
  const mount = async (server) => {
    const { default: app } = await import('./server/app.js');
    server.middlewares.use((req, res, next) => (req.url.startsWith('/api/') ? app(req, res, next) : next()));
  };
  return { name: 'imm-api', configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig(({ mode }) => {
  // Muat .env ke process.env supaya terbaca oleh server/
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return { plugins: [react(), api()] };
});
