import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { HttpError } from './errors.js';

// Penyimpanan konten:
// - DATABASE_URL / POSTGRES_URL ada → Postgres (Neon). Dipakai di Vercel.
// - Tidak ada → file .data/content.json. Hanya untuk development lokal.
// Penyimpanan gambar:
// - BLOB_READ_WRITE_TOKEN ada → Vercel Blob.
// - Tidak ada → public/uploads. Hanya untuk development lokal.

const root = process.cwd();
const dbUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL;

function fileStore() {
  const file = path.join(root, '.data', 'content.json');

  async function read() {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'));
    } catch (e) {
      if (e.code === 'ENOENT') return {};
      throw e;
    }
  }

  async function write(data) {
    if (process.env.VERCEL) throw new HttpError(500, 'Database belum diatur (DATABASE_URL). Konten tidak bisa disimpan.');
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  }

  return {
    getAll: read,
    async set(key, value) {
      await write({ ...(await read()), [key]: value });
    },
    async remove(key) {
      const data = await read();
      delete data[key];
      await write(data);
    },
  };
}

function pgStore(url) {
  let ready = null;

  // Koneksi + pembuatan tabel dilakukan sekali, saat pertama dipakai
  function db() {
    ready ??= (async () => {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(url);
      await sql`CREATE TABLE IF NOT EXISTS site_content (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
      return sql;
    })().catch((e) => {
      ready = null;
      throw e;
    });
    return ready;
  }

  return {
    async getAll() {
      const sql = await db();
      const rows = await sql`SELECT key, value FROM site_content`;
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
    async set(key, value) {
      const sql = await db();
      await sql`INSERT INTO site_content (key, value) VALUES (${key}, ${JSON.stringify(value)}::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
    },
    async remove(key) {
      const sql = await db();
      await sql`DELETE FROM site_content WHERE key = ${key}`;
    },
  };
}

let store = null;
export const contentStore = () => (store ??= dbUrl() ? pgStore(dbUrl()) : fileStore());

const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function saveImage(buffer, originalName, contentType) {
  const ext = IMAGE_TYPES[contentType];
  if (!ext) throw new HttpError(415, 'Format gambar harus JPG, PNG, WEBP, atau GIF.');
  const base =
    String(originalName)
      .replace(/\.[^.]*$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'gambar';
  const name = `${base}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${name}`, buffer, { access: 'public', contentType });
    return blob.url;
  }
  if (process.env.VERCEL) throw new HttpError(500, 'Penyimpanan gambar belum diatur (BLOB_READ_WRITE_TOKEN).');

  const dir = path.join(root, 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}
