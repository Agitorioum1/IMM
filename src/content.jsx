import { createContext, useContext, useEffect, useState } from 'react';
import { defaultContent, mergeContent } from './data.js';

const ContentContext = createContext(defaultContent);

export const useContent = () => useContext(ContentContext);

// Ambil konten dari API sekali saat situs dibuka. Bila API gagal/tidak ada, situs tetap tampil dengan konten bawaan.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((saved) => alive && setContent(mergeContent(saved)));
    return () => {
      alive = false;
    };
  }, []);

  // Tunggu konten tersimpan supaya tidak berkedip dari isi lama ke isi baru
  if (!content) return null;

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
