import { iconNames } from '../components/Icon.jsx';

// Deskripsi form untuk tiap bagian konten. Kunci bagian = kunci di defaultContent (src/data.js).
// Tipe field: text, textarea, number, image, select, checkbox, object (fields), list (of), strings (daftar teks).

const text = (key, label, extra) => ({ key, label, type: 'text', ...extra });
const area = (key, label, extra) => ({ key, label, type: 'textarea', ...extra });
const image = (key, label, extra) => ({ key, label, type: 'image', ...extra });
const strings = (key, label, extra) => ({ key, label, type: 'strings', ...extra });
const list = (key, label, of, extra) => ({ key, label, type: 'list', of, ...extra });
const object = (key, label, fields) => ({ key, label, type: 'object', fields });

const heading = [text('eyebrow', 'Label kecil di atas judul'), text('title', 'Judul bagian')];
const picture = { type: 'object', fields: [image('img', 'Gambar'), text('alt', 'Deskripsi gambar (alt)')] };

const person = (withTeam) => ({
  type: 'object',
  fields: [
    text('name', 'Nama', { help: 'Kosongkan untuk posisi tanpa nama (tampil sebagai "Tim").' }),
    text('role', 'Jabatan'),
    text('note', 'Catatan atasan', { help: 'Opsional, tampil sebagai "↳ catatan".' }),
    ...(withTeam
      ? [
          { key: 'lead', label: 'Tampilkan sebagai pimpinan (kartu gelap)', type: 'checkbox' },
          {
            key: 'teamLayout',
            label: 'Susunan tim di bawahnya',
            type: 'select',
            options: [
              { value: '', label: 'Ditumpuk ke bawah' },
              { value: 'row', label: 'Berjajar ke samping' },
            ],
          },
          list('team', 'Tim (bawahan langsung)', person(false), { itemLabel: (m) => m.name || m.role }),
        ]
      : []),
  ],
});

export const sections = [
  {
    key: 'company',
    label: 'Perusahaan & Kontak',
    description: 'Nama, alamat, dan kontak yang dipakai di header, footer, dan bagian Kontak.',
    schema: {
      type: 'object',
      fields: [
        text('name', 'Nama perusahaan'),
        text('short', 'Nama singkat (di header)'),
        text('tagline', 'Tagline (di bawah nama)'),
        area('address', 'Alamat'),
        object('phone', 'Telepon kantor', [text('label', 'Ditampilkan'), text('href', 'Link', { help: 'Format: tel:+62778...' })]),
        object('mobile', 'Handphone', [text('label', 'Ditampilkan'), text('href', 'Link', { help: 'Format: tel:+62813...' })]),
        text('email', 'Email'),
        text('whatsapp', 'Link WhatsApp', { help: 'Format: https://wa.me/62813...' }),
      ],
    },
  },
  {
    key: 'hero',
    label: 'Hero (bagian atas)',
    description: 'Judul utama, gambar, dan angka statistik di bagian paling atas.',
    schema: {
      type: 'object',
      fields: [
        text('pill', 'Label kecil'),
        text('titleBefore', 'Judul — sebelum kata sorotan'),
        text('titleHighlight', 'Judul — kata sorotan (bergaris bawah)'),
        text('titleAfter', 'Judul — sesudah kata sorotan'),
        area('lead', 'Kalimat pembuka'),
        image('image', 'Gambar utama'),
        text('imageAlt', 'Deskripsi gambar (alt)'),
        text('chip', 'Label di atas gambar'),
        text('badgeTitle', 'Badge — judul'),
        text('badgeText', 'Badge — teks'),
        list(
          'stats',
          'Statistik',
          {
            type: 'object',
            fields: [
              { key: 'value', label: 'Angka', type: 'number' },
              text('suffix', 'Akhiran', { help: 'Opsional, mis. "+".' }),
              text('label', 'Keterangan'),
            ],
          },
          { itemLabel: (s) => `${s.value ?? ''}${s.suffix ?? ''} ${s.label ?? ''}` }
        ),
      ],
    },
  },
  {
    key: 'about',
    label: 'Tentang Kami',
    description: 'Judul, kalimat pembuka, visi, dan misi.',
    schema: {
      type: 'object',
      fields: [...heading, area('lead', 'Kalimat pembuka'), area('vision', 'Visi'), strings('mission', 'Misi')],
    },
  },
  {
    key: 'jobScope',
    label: 'Lingkup Pekerjaan',
    description: 'Daftar yang berjalan di pita bawah hero.',
    schema: { type: 'strings', label: 'Lingkup pekerjaan' },
  },
  {
    key: 'structure',
    label: 'Struktur Organisasi',
    description: 'Bagan organisasi, per tingkat dari atas ke bawah.',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        list(
          'organization',
          'Tingkat',
          {
            type: 'object',
            fields: [
              text('level', 'Nama tingkat', { help: 'Hanya untuk penanda di admin, tidak tampil di situs.' }),
              list('members', 'Anggota', person(true), { itemLabel: (m) => m.name || m.role }),
            ],
          },
          { itemLabel: (t) => t.level }
        ),
      ],
    },
  },
  {
    key: 'services',
    label: 'Layanan',
    description: 'Kartu layanan dan isi halaman detail tiap layanan.',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        list(
          'items',
          'Layanan',
          {
            type: 'object',
            fields: [
              text('title', 'Nama layanan'),
              text('slug', 'Alamat halaman detail', {
                help: 'Huruf kecil dan tanda hubung, harus unik. Contoh: piping-ducting → /layanan/piping-ducting',
              }),
              {
                key: 'icon',
                label: 'Ikon',
                type: 'select',
                options: iconNames.map((n) => ({ value: n, label: n })),
              },
              area('desc', 'Deskripsi singkat (di kartu)'),
              object('detail', 'Halaman detail', [
                area('intro', 'Paragraf pembuka'),
                strings('scope', 'Lingkup pekerjaan'),
                list('images', 'Foto', picture, { itemLabel: (p) => p.alt || p.img }),
              ]),
            ],
          },
          { itemLabel: (s) => s.title }
        ),
      ],
    },
  },
  {
    key: 'projects',
    label: 'Proyek',
    description: 'Galeri foto proyek dan proyek unggulan.',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        list(
          'items',
          'Foto proyek',
          {
            type: 'object',
            fields: [
              image('img', 'Gambar'),
              text('title', 'Judul'),
              text('sub', 'Keterangan'),
              text('alt', 'Deskripsi gambar (alt)'),
              {
                key: 'size',
                label: 'Ukuran di galeri',
                type: 'select',
                options: [
                  { value: '', label: 'Normal' },
                  { value: 'wide', label: 'Lebar (2 kolom)' },
                  { value: 'tall', label: 'Tinggi (2 baris)' },
                ],
              },
            ],
          },
          { itemLabel: (p) => p.title }
        ),
        object('highlight', 'Proyek unggulan', [
          text('title', 'Judul', { help: 'Kosongkan untuk menyembunyikan.' }),
          text('desc', 'Keterangan'),
          text('year', 'Tahun'),
        ]),
      ],
    },
  },
  {
    key: 'quality',
    label: 'Kebijakan Mutu',
    description: 'Foto, poin mutu, dan daftar produk.',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        list('images', 'Foto', picture, { itemLabel: (p) => p.alt || p.img }),
        strings('points', 'Poin mutu'),
        strings('products', 'Produk'),
      ],
    },
  },
  {
    key: 'clients',
    label: 'Klien & Partner',
    description: 'Daftar klien dan partner.',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        strings('items', 'Klien'),
        list(
          'partners',
          'Partner',
          { type: 'object', fields: [text('name', 'Nama'), text('desc', 'Keterangan')] },
          { itemLabel: (p) => p.name }
        ),
      ],
    },
  },
  {
    key: 'contact',
    label: 'Kontak',
    description: 'Judul bagian Kontak dan narahubung. Alamat & nomor kantor diatur di "Perusahaan & Kontak".',
    schema: {
      type: 'object',
      fields: [
        ...heading,
        area('lead', 'Kalimat pembuka'),
        list(
          'persons',
          'Narahubung',
          {
            type: 'object',
            fields: [
              text('name', 'Nama'),
              text('role', 'Jabatan'),
              text('phone', 'Nomor (ditampilkan)'),
              text('href', 'Link nomor', { help: 'Format: tel:+62813...' }),
            ],
          },
          { itemLabel: (p) => p.name }
        ),
      ],
    },
  },
];
