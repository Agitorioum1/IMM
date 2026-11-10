async function request(url, options = {}) {
  const res = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Gagal (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  me: () => request('/api/auth/me'),
  login: (username, password) => request('/api/auth/login', json('POST', { username, password })),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  content: () => request('/api/content', { cache: 'no-store' }),
  save: (key, value) => request(`/api/content/${key}`, json('PUT', { value })),
  reset: (key) => request(`/api/content/${key}`, { method: 'DELETE' }),
  upload: (file) =>
    request('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'X-Filename': encodeURIComponent(file.name) },
      body: file,
    }),
};
