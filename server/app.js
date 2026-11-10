import express from 'express';
import { defaultContent } from '../src/data.js';
import { checkCredentials, currentUser, endSession, loginGuard, requireAuth, startSession } from './auth.js';
import { HttpError } from './errors.js';
import { contentStore, saveImage } from './storage.js';

// API situs + panel admin. Dipakai di dua tempat:
// - development: dipasang di dev server Vite (lihat vite.config.js)
// - Vercel: api/index.js

const SECTIONS = Object.keys(defaultContent);

// Express 4 tidak menangkap error dari handler async; bungkus agar diteruskan ke error handler
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const app = express();
app.disable('x-powered-by');
// Di Vercel, IP pengunjung ada di header proxy (dipakai untuk batas percobaan login)
if (process.env.VERCEL) app.set('trust proxy', true);

app.get(
  '/api/content',
  wrap(async (req, res) => {
    const saved = await contentStore().getAll();
    // Cache singkat di CDN; perubahan dari admin tampil paling lambat ~10 detik
    res.set('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
    res.json(saved);
  })
);

app.post(
  '/api/auth/login',
  express.json({ limit: '10kb' }),
  wrap(async (req, res) => {
    const guard = loginGuard(req.ip);
    const { username = '', password = '' } = req.body ?? {};
    if (!checkCredentials(username, password)) {
      guard.fail();
      throw new HttpError(401, 'Username atau password salah.');
    }
    guard.ok();
    startSession(req, res, username);
    res.json({ user: username });
  })
);

app.post('/api/auth/logout', (req, res) => {
  endSession(req, res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = currentUser(req);
  res.set('Cache-Control', 'no-store');
  if (!user) return res.status(401).json({ error: 'Belum login.' });
  res.json({ user });
});

function checkSection(key) {
  if (!SECTIONS.includes(key)) throw new HttpError(404, `Bagian "${key}" tidak dikenal.`);
}

app.put(
  '/api/content/:key',
  requireAuth,
  express.json({ limit: '1mb' }),
  wrap(async (req, res) => {
    checkSection(req.params.key);
    const { value } = req.body ?? {};
    // Bentuk data harus sama dengan bawaannya (daftar tetap daftar, objek tetap objek)
    const wantArray = Array.isArray(defaultContent[req.params.key]);
    if (value === null || typeof value !== 'object' || Array.isArray(value) !== wantArray) {
      throw new HttpError(400, 'Format data tidak sesuai.');
    }
    await contentStore().set(req.params.key, value);
    res.json({ ok: true });
  })
);

// Hapus konten tersimpan → bagian itu kembali memakai konten bawaan
app.delete(
  '/api/content/:key',
  requireAuth,
  wrap(async (req, res) => {
    checkSection(req.params.key);
    await contentStore().remove(req.params.key);
    res.json({ ok: true });
  })
);

app.post(
  '/api/upload',
  requireAuth,
  express.raw({ type: 'image/*', limit: '4mb' }),
  wrap(async (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) throw new HttpError(400, 'File gambar kosong.');
    const name = decodeURIComponent(req.get('x-filename') ?? 'gambar');
    const url = await saveImage(req.body, name, req.get('content-type'));
    res.json({ url });
  })
);

app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status ?? err.statusCode ?? 500;
  if (status >= 500) console.error(err);
  const message =
    err.type === 'entity.too.large' ? 'Ukuran file/data terlalu besar.' : status < 500 || err instanceof HttpError ? err.message : 'Terjadi kesalahan di server.';
  res.status(status).json({ error: message });
});

export default app;
