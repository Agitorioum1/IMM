import { useEffect, useMemo, useState } from 'react';
import { defaultContent, mergeContent } from '../data.js';
import { api } from './api.js';
import { Field } from './fields.jsx';
import { sections } from './schema.js';
import './admin.css';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = sedang dicek, null = belum login
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    document.title = 'Admin — PT Inti Mas Mulia';
    // Jangan sampai halaman admin diindeks mesin pencari
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' });
    document.head.appendChild(meta);
    api.me().then(
      (r) => setUser(r.user),
      () => setUser(null)
    );
    return () => meta.remove();
  }, []);

  if (user === undefined) return <div className="admin adm-center">Memuat…</div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <Dashboard
        user={user}
        onExpired={() => setExpired(true)}
        onLogout={async () => {
          await api.logout().catch(() => {});
          setUser(null);
        }}
      />
      {/* Sesi habis saat mengedit: login ulang di atas editor supaya perubahan yang belum disimpan tidak hilang */}
      {expired && <Login overlay onLogin={() => setExpired(false)} />}
    </>
  );
}

function Login({ onLogin, overlay = false }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api.login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`admin adm-center ${overlay ? 'adm-overlay' : ''}`}>
      <form className="adm-login" onSubmit={submit}>
        <img src="/img/logo.png" alt="" width="346" height="234" />
        <h1>{overlay ? 'Sesi berakhir' : 'Admin'}</h1>
        <p>{overlay ? 'Login ulang untuk melanjutkan. Perubahan Anda masih tersimpan di layar.' : 'Kelola konten situs PT Inti Mas Mulia.'}</p>
        <label className="adm-field">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="adm-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>
        {error && <p className="adm-error">{error}</p>}
        <button className="adm-btn primary" disabled={busy}>
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
        {!overlay && (
          <a href="/" className="adm-link">
            ← Kembali ke situs
          </a>
        )}
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout, onExpired }) {
  const [saved, setSaved] = useState(null); // konten tersimpan di server (mentah, per bagian)
  const [drafts, setDrafts] = useState({}); // hasil edit yang belum disimpan, per bagian
  const [active, setActive] = useState(sections[0].key);
  const [status, setStatus] = useState(null); // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api.content().then(setSaved, (e) => setLoadError(e.message));
  }, []);

  const current = useMemo(() => (saved ? mergeContent(saved) : null), [saved]);
  const dirtyKeys = sections.map((s) => s.key).filter((k) => drafts[k] !== undefined && !same(drafts[k], current?.[k]));

  // Peringatan bila menutup tab dengan perubahan yang belum disimpan
  useEffect(() => {
    if (!dirtyKeys.length) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirtyKeys.length]);

  if (loadError) return <div className="admin adm-center adm-error">Gagal memuat konten: {loadError}</div>;
  if (!current) return <div className="admin adm-center">Memuat konten…</div>;

  const section = sections.find((s) => s.key === active);
  const value = drafts[active] ?? current[active];
  const dirty = dirtyKeys.includes(active);
  const customized = saved[active] !== undefined;

  const run = async (fn, okText) => {
    setBusy(true);
    setStatus(null);
    try {
      await fn();
      setStatus({ type: 'ok', text: okText });
    } catch (e) {
      if (e.status === 401) onExpired();
      setStatus({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(async () => {
      await api.save(active, value);
      setSaved((s) => ({ ...s, [active]: value }));
      setDrafts(({ [active]: _, ...rest }) => rest);
    }, 'Tersimpan. Perubahan tampil di situs dalam beberapa detik.');

  const discard = () => {
    setDrafts(({ [active]: _, ...rest }) => rest);
    setStatus(null);
  };

  const resetToDefault = () => {
    if (!confirm(`Kembalikan "${section.label}" ke konten bawaan? Semua perubahan tersimpan di bagian ini akan hilang.`)) return;
    run(async () => {
      await api.reset(active);
      setSaved(({ [active]: _, ...rest }) => rest);
      setDrafts(({ [active]: _, ...rest }) => rest);
    }, 'Bagian ini kembali memakai konten bawaan.');
  };

  return (
    <div className="admin adm-layout">
      <aside className="adm-side">
        <div className="adm-brand">
          <img src="/img/logo.png" alt="" width="346" height="234" />
          <span>
            Admin
            <small>{user}</small>
          </span>
        </div>
        <nav>
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              className={s.key === active ? 'active' : ''}
              onClick={() => {
                setActive(s.key);
                setStatus(null);
              }}
            >
              {s.label}
              {dirtyKeys.includes(s.key) && <i className="adm-dot" title="Belum disimpan" />}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn small">
            Lihat situs ↗
          </a>
          <button type="button" className="adm-btn small ghost" onClick={onLogout}>
            Keluar
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-head">
          <div>
            <h1>{section.label}</h1>
            <p>{section.description}</p>
            {!customized && <span className="adm-badge">Memakai konten bawaan</span>}
          </div>
          <div className="adm-actions">
            {customized && (
              <button type="button" className="adm-btn ghost" disabled={busy} onClick={resetToDefault}>
                Kembalikan ke bawaan
              </button>
            )}
            <button type="button" className="adm-btn ghost" disabled={!dirty || busy} onClick={discard}>
              Batalkan
            </button>
            <button type="button" className="adm-btn primary" disabled={!dirty || busy} onClick={save}>
              {busy ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </header>

        {status && <p className={status.type === 'ok' ? 'adm-ok' : 'adm-error'}>{status.text}</p>}

        <div className="adm-form">
          <Field
            schema={section.schema}
            value={value ?? defaultContent[active]}
            onChange={(v) => setDrafts((d) => ({ ...d, [active]: v }))}
          />
        </div>
      </main>
    </div>
  );
}
