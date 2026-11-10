import crypto from 'node:crypto';
import { HttpError } from './errors.js';

// Sesi admin = token bertanda tangan HMAC di cookie httpOnly. Satu akun admin dari env:
// ADMIN_USERNAME (bawaan "admin"), ADMIN_PASSWORD, SESSION_SECRET.

const COOKIE = 'imm_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

// Saat dev tanpa SESSION_SECRET, pakai rahasia acak per proses (sesi hilang tiap server restart)
const devSecret = crypto.randomBytes(32).toString('hex');

function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.VERCEL) throw new HttpError(500, 'SESSION_SECRET belum diatur di environment variables.');
  return devSecret;
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const hmac = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

function sign(payload) {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

function verify(token) {
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  return payload.exp > Date.now() / 1000 ? payload : null;
}

function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Secure hanya bila diakses lewat HTTPS (di Vercel terbaca dari header proxy), supaya login lokal via http tetap jalan
function cookieHeader(req, value, maxAge) {
  const secure = req.secure ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function checkCredentials(username, password) {
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedPass) throw new HttpError(500, 'ADMIN_PASSWORD belum diatur di environment variables.');
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  // Bandingkan hash supaya panjang sama dan waktu perbandingan konstan
  const userOk = crypto.timingSafeEqual(sha(username), sha(expectedUser));
  const passOk = crypto.timingSafeEqual(sha(password), sha(expectedPass));
  return userOk && passOk;
}

export function startSession(req, res, username) {
  const token = sign({ sub: username, exp: Math.floor(Date.now() / 1000) + MAX_AGE });
  res.setHeader('Set-Cookie', cookieHeader(req, token, MAX_AGE));
}

export function endSession(req, res) {
  res.setHeader('Set-Cookie', cookieHeader(req, '', 0));
}

export function currentUser(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  try {
    return verify(token)?.sub ?? null;
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  if (!currentUser(req)) return res.status(401).json({ error: 'Silakan login terlebih dahulu.' });
  next();
}

// Batas percobaan login sederhana per IP (di memori; cukup untuk satu admin)
const attempts = new Map();
const MAX_FAILS = 5;
const LOCK_MS = 10 * 60 * 1000;

export function loginGuard(ip) {
  const a = attempts.get(ip);
  if (a && a.fails >= MAX_FAILS && Date.now() - a.last < LOCK_MS) {
    throw new HttpError(429, 'Terlalu banyak percobaan login. Coba lagi 10 menit lagi.');
  }
  return {
    fail() {
      const cur = attempts.get(ip);
      const fresh = !cur || Date.now() - cur.last >= LOCK_MS;
      attempts.set(ip, { fails: fresh ? 1 : cur.fails + 1, last: Date.now() });
    },
    ok() {
      attempts.delete(ip);
    },
  };
}
