import app from '../server/app.js';

// Fungsi serverless Vercel. Semua /api/* diarahkan ke sini oleh vercel.json;
// path aslinya dikirim lewat ?path= bila req.url sudah diubah menjadi /api.
export default function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith('/api/') && url.searchParams.has('path')) {
    const path = url.searchParams.get('path');
    url.searchParams.delete('path');
    req.url = `/api/${path}${url.search}`;
  }
  return app(req, res);
}
