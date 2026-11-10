import { useRef, useState } from 'react';
import { imgSrc } from '../data.js';
import { api } from './api.js';

// Nilai kosong untuk item baru sesuai skemanya
export function emptyValue(schema) {
  switch (schema.type) {
    case 'object':
      return Object.fromEntries(schema.fields.map((f) => [f.key, emptyValue(f)]));
    case 'list':
    case 'strings':
      return [];
    case 'number':
      return 0;
    case 'checkbox':
      return false;
    case 'select':
      return schema.options[0]?.value ?? '';
    default:
      return '';
  }
}

export function Field({ schema, value, onChange }) {
  switch (schema.type) {
    case 'object':
      return <ObjectField schema={schema} value={value ?? {}} onChange={onChange} />;
    case 'list':
      return <ListField schema={schema} value={value ?? []} onChange={onChange} />;
    case 'strings':
      return <StringsField value={value ?? []} onChange={onChange} />;
    case 'image':
      return <ImageField value={value ?? ''} onChange={onChange} />;
    case 'textarea':
      return <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
      return <input type="number" value={value ?? 0} onChange={(e) => onChange(e.target.valueAsNumber || 0)} />;
    case 'checkbox':
      return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {schema.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    default:
      return <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

function ObjectField({ schema, value, onChange }) {
  return (
    <div className="adm-object">
      {schema.fields.map((f) => {
        const input = <Field schema={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />;
        // Field berisi beberapa input dibungkus fieldset, bukan <label>
        const nested = ['object', 'list', 'strings', 'image'].includes(f.type);
        if (nested) {
          return (
            <fieldset className="adm-group" key={f.key}>
              <legend>{f.label}</legend>
              {f.help && <small className="adm-help">{f.help}</small>}
              {input}
            </fieldset>
          );
        }
        return (
          <label className={`adm-field ${f.type === 'checkbox' ? 'inline' : ''}`} key={f.key}>
            <span>{f.label}</span>
            {input}
            {f.help && <small className="adm-help">{f.help}</small>}
          </label>
        );
      })}
    </div>
  );
}

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

function ItemTools({ index, count, onMove, onRemove }) {
  // preventDefault: tombol berada di dalam <summary>, jangan ikut membuka/menutup item
  const act = (fn) => (e) => {
    e.preventDefault();
    fn();
  };
  return (
    <span className="adm-tools">
      <button type="button" title="Naik" disabled={index === 0} onClick={act(() => onMove(-1))}>
        ↑
      </button>
      <button type="button" title="Turun" disabled={index === count - 1} onClick={act(() => onMove(1))}>
        ↓
      </button>
      <button type="button" title="Hapus" className="danger" onClick={act(onRemove)}>
        ✕
      </button>
    </span>
  );
}

function ListField({ schema, value, onChange }) {
  // Item yang baru ditambahkan langsung dibuka (sekali, setelah itu bebas ditutup)
  const pendingOpen = useRef(-1);
  const update = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const remove = (i) => {
    if (confirm('Hapus item ini?')) onChange(value.filter((_, j) => j !== i));
  };

  return (
    <div className="adm-list">
      {value.map((item, i) => (
        <details
          className="adm-item"
          key={i}
          ref={(el) => {
            if (el && pendingOpen.current === i) {
              el.open = true;
              pendingOpen.current = -1;
            }
          }}
        >
          <summary>
            <span className="adm-item-title">{schema.itemLabel?.(item) || `Item ${i + 1}`}</span>
            <ItemTools
              index={i}
              count={value.length}
              onMove={(d) => onChange(move(value, i, d))}
              onRemove={() => remove(i)}
            />
          </summary>
          <div className="adm-item-body">
            <Field schema={schema.of} value={item} onChange={(v) => update(i, v)} />
          </div>
        </details>
      ))}
      <button
        type="button"
        className="adm-add"
        onClick={() => {
          pendingOpen.current = value.length;
          onChange([...value, emptyValue(schema.of)]);
        }}
      >
        + Tambah {schema.label?.toLowerCase() ?? 'item'}
      </button>
    </div>
  );
}

function StringsField({ value, onChange }) {
  return (
    <div className="adm-strings">
      {value.map((s, i) => (
        <div className="adm-string" key={i}>
          <input type="text" value={s} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <ItemTools
            index={i}
            count={value.length}
            onMove={(d) => onChange(move(value, i, d))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button type="button" className="adm-add" onClick={() => onChange([...value, ''])}>
        + Tambah baris
      </button>
    </div>
  );
}

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-image">
      <div className="adm-thumb">{value ? <img src={imgSrc(value)} alt="" /> : <span>Belum ada gambar</span>}</div>
      <div className="adm-image-controls">
        <input
          type="text"
          value={value}
          placeholder="nama-file.jpg atau URL"
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="adm-btn small">
          {busy ? 'Mengunggah…' : 'Unggah gambar'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={busy}
            onChange={(e) => {
              upload(e.target.files[0]);
              e.target.value = '';
            }}
          />
        </label>
        <small className="adm-help">JPG, PNG, WEBP, atau GIF, maks. 4 MB.</small>
        {error && <small className="adm-error">{error}</small>}
      </div>
    </div>
  );
}
