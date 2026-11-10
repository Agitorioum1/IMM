// Konten bawaan situs, diambil dari Company Profile PT Inti Mas Mulia (CP.IMM.pdf).
// Konten yang diubah lewat panel admin (/admin) disimpan di database dan menimpa konten ini per bagian;
// bagian yang belum pernah diubah tetap memakai isi di file ini.
// File ini juga dipakai server (daftar bagian yang boleh disimpan), jadi isinya harus data biasa tanpa JSX.

// Menu navigasi terikat ke id bagian di halaman, jadi tidak diubah lewat admin.
export const navLinks = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#proyek', label: 'Proyek' },
  { href: '#klien', label: 'Klien' },
];

// Nilai gambar: nama file di public/img (mis. 'piping.jpg'), path ('/uploads/x.jpg'), atau URL lengkap.
export const imgSrc = (v) => (!v ? '' : /^(https?:)?\/\//.test(v) || v.startsWith('/') ? v : `/img/${v}`);

export const defaultContent = {
  company: {
    name: 'PT Inti Mas Mulia',
    short: 'Inti Mas Mulia',
    tagline: 'General Contractor · Batam',
    address: 'Jl. Trans Barelang, Ruko Griya Laguna Mas Blok A No. 09, Batam',
    phone: { label: '(0778) 3852 598', href: 'tel:+627783852598' },
    mobile: { label: '0813 7109 0660', href: 'tel:+6281371090660' },
    email: 'intimasmulia.pt@gmail.com',
    whatsapp: 'https://wa.me/6281371090660',
  },

  hero: {
    pill: 'General Contractor · Batam',
    titleBefore: 'Engineering',
    titleHighlight: 'presisi',
    titleAfter: 'untuk industri.',
    lead: 'Steam boiler, piping, electrical, hingga automation — dikerjakan dengan tepat.',
    image: 'hero-boiler.jpg',
    imageAlt: 'Teknisi IMM melakukan commissioning burner steam boiler',
    chip: 'Mechanical · Electrical · Automation',
    badgeTitle: 'Office & Workshop',
    badgeText: 'Batam, Kepulauan Riau',
    stats: [
      { value: 14, suffix: '', label: 'Lingkup kerja' },
      { value: 50, suffix: '+', label: 'Klien' },
      { value: 2, suffix: '', label: 'Partner teknologi' },
      { value: 1, suffix: '', label: 'Workshop di Batam' },
    ],
  },

  about: {
    eyebrow: 'Tentang Kami',
    title: 'Tim solid. Mesin modern.',
    lead: 'Solusi engineering yang dirancang, dibangun, dan dipasang sesuai kebutuhan Anda.',
    vision:
      'Perusahaan yang berkompeten, profesional, aman dan bermutu dalam penjualan, mitra layanan, dan mitra bisnis yang selalu memenuhi kebutuhan pelanggan.',
    mission: [
      'Produk berkualitas & kompetitif',
      'Layanan profesional',
      'Kemitraan yang saling menguntungkan',
      'Inovasi yang memberi nilai tambah',
    ],
  },

  jobScope: [
    'Marine Safety Service Station',
    'Mechanical',
    'Steam Boiler',
    'Electrical',
    'Construction Civil',
    'Machining',
    'Automation',
    'Jig & Fixture',
    'Repair & Reconditioning',
    'Service & Maintenance',
    'Panel Control',
    'Conveyor System',
    'Overhaul ME & AE',
    'Overhaul Stern Shaft',
  ],

  // Struktur organisasi, per tingkat dari atas ke bawah.
  // `note` = atasan langsung untuk tingkat staf.
  // `team` = bawahan langsung yang digambar sebagai garis lurus tersendiri di bawah anggota itu.
  // `teamLayout: 'row'` = anggota `team` dijajarkan ke samping, bukan ditumpuk ke bawah.
  structure: {
    eyebrow: 'Struktur Organisasi',
    title: 'Tim di balik setiap proyek.',
    organization: [
      { level: 'Pimpinan', members: [{ name: 'Nanang Supriyanto', role: 'Director', lead: true }] },
      {
        level: 'Manajemen',
        members: [
          { name: 'Robert Dwi Putra', role: 'General Manager' },
          { name: 'Suparman', role: 'Operational Manager' },
          {
            name: 'Mohammad Alfi',
            role: 'Head of CI & Recruitment Agency',
            teamLayout: 'row',
            team: [
              { name: 'Agit Pratama', role: 'Head of Operation' },
              { name: 'Agit Pratama', role: 'Head of Operation' },
            ],
          },
        ],
      },
      {
        level: 'Kepala Divisi',
        members: [
          { name: 'Aris Pardomuan S', role: 'Senior Marketing', team: [{ name: '', role: 'Marketing' }] },
          { name: 'Safix Alfian', role: 'Designer' },
          { name: 'Ariawati', role: 'Admin & Procurement' },
          { name: 'Nadia', role: 'HRD' },
          {
            name: 'Heri Tri Handoko',
            role: 'Engineering',
            team: [
              { name: 'Budi', role: 'Fabrication' },
              { name: 'Habitra', role: 'Technician' },
            ],
          },
        ],
      },
    ],
  },

  // `slug` = alamat halaman detail (/layanan/<slug>); `detail` = isi halaman detail.
  services: {
    eyebrow: 'Layanan',
    title: 'Satu mitra, semua kebutuhan engineering.',
    items: [
      {
        slug: 'piping-ducting',
        icon: 'ship',
        title: 'Piping & Ducting',
        desc: 'Fabrikasi dan instalasi jalur pipa.',
        detail: {
          intro: 'Fabrikasi, pengelasan, dan instalasi jalur pipa serta sistem ducting untuk area pabrik dan industri.',
          scope: [
            'Fabrikasi & pengelasan pipa',
            'Instalasi jalur pipa & flange',
            'Instalasi sistem ducting',
            'Repair & assembly cooling system',
          ],
          images: [
            { img: 'piping.jpg', alt: 'Fabrikasi jalur pipa dan flange' },
            { img: 'ducting.jpg', alt: 'Instalasi sistem ducting di area pabrik' },
          ],
        },
      },
      {
        slug: 'offshore',
        icon: 'rig',
        title: 'Offshore',
        desc: 'Kelistrikan, panel kontrol, penerangan.',
        detail: {
          intro:
            'Perbaikan dan perawatan permesinan kapal serta peralatan keselamatan, dikerjakan di workshop maupun langsung di atas kapal.',
          scope: [
            'Overhaul ME & AE',
            'Overhaul stern shaft (STAFA)',
            'Overhaul windlass',
            'Cleaning air cooler ME - AE',
            'Centreless connecting rod',
            'Service lifeboat (skoci)',
            'Carpenter & interior kapal',
          ],
          images: [
            { img: 'marine-safety.jpg', alt: 'Pengiriman lifeboat untuk servis' },
            { img: 'reconditioning.jpg', alt: 'Pengukuran presisi saat rekondisi komponen' },
          ],
        },
      },
      {
        slug: 'manufacturing',
        icon: 'factory',
        title: 'Manufacturing',
        desc: 'Mesin otomatis, conveyor, retrofit.',
        detail: {
          intro:
            'Desain, pembuatan, dan instalasi peralatan otomasi untuk industri semikonduktor, makanan, dan manufaktur, termasuk upgrade dan retrofit mesin yang sudah ada.',
          scope: [
            'Tool & die system',
            'Product tester',
            'Wire coiling system',
            'Inspection system',
            'Packaging system',
            'Jig & fixture',
            'Conveyor system & panel control',
          ],
          images: [{ img: 'automation.jpg', alt: 'Desain 3D mesin otomasi' }],
        },
      },
      {
        slug: 'civil',
        icon: 'wrench',
        title: 'Civil',
        desc: 'Jig, fixture, tool & die presisi.',
        detail: {
          intro: 'Pekerjaan konstruksi sipil dan perawatan bangunan, dari renovasi hingga instalasi utilitas.',
          scope: [
            'Konstruksi sipil',
            'Renovasi & perawatan bangunan',
            'Instalasi kelistrikan & penerangan',
            'Perawatan unit HVAC',
            'Heavy equipment service',
          ],
          images: [
            { img: 'electrical.jpg', alt: 'Instalasi kabel tray dan penerangan' },
            { img: 'maintenance.jpg', alt: 'Perawatan unit outdoor HVAC' },
            { img: 'overhaul.jpg', alt: 'Overhaul alat berat di lapangan' },
          ],
        },
      },
      {
        slug: 'continuous-improvement',
        icon: 'infinity',
        title: 'Continous Improvement & Recruitment Agency',
        desc: 'Overhaul ME/AE dan stern shaft.',
        detail: {
          intro:
            'Pendampingan perbaikan berkelanjutan pada proses kerja, serta penyediaan tenaga kerja sesuai kebutuhan proyek.',
          scope: ['Continuous improvement proses kerja', 'Rekrutmen & penyediaan tenaga kerja'],
          images: [],
        },
      },
    ],
  },

  // size: 'wide' | 'tall' | '' — mengatur layout grid galeri
  projects: {
    eyebrow: 'Proyek',
    title: 'Hasil kerja di lapangan.',
    items: [
      { img: 'steam-boiler.jpg', title: 'Steam Boiler', sub: 'Instalasi & commissioning', alt: 'Instalasi dua unit steam boiler', size: 'wide' },
      { img: 'piping.jpg', title: 'Piping', sub: 'Fabrikasi & pengelasan', alt: 'Fabrikasi jalur pipa dan flange', size: 'tall' },
      { img: 'marine-safety.jpg', title: 'Marine Safety', sub: 'Servis lifeboat', alt: 'Pengiriman lifeboat untuk servis', size: 'tall' },
      { img: 'reconditioning.jpg', title: 'Reconditioning', sub: 'Pengukuran presisi', alt: 'Pengukuran presisi saat rekondisi komponen', size: '' },
      { img: 'automation.jpg', title: 'Automation', sub: 'Desain mesin custom', alt: 'Desain 3D mesin otomasi', size: '' },
      { img: 'ducting.jpg', title: 'Ducting System', sub: 'Instalasi area pabrik', alt: 'Instalasi sistem ducting di area pabrik', size: 'wide' },
      { img: 'electrical.jpg', title: 'Electrical', sub: 'Cable tray & lighting', alt: 'Instalasi kabel tray dan penerangan', size: '' },
      { img: 'maintenance.jpg', title: 'Maintenance', sub: 'Servis unit HVAC', alt: 'Perawatan unit outdoor HVAC', size: '' },
    ],
    highlight: {
      title: 'Pemeliharaan Mesin Weed Harvester',
      desc: 'Proyek untuk BP Batam.',
      year: '2021',
    },
  },

  quality: {
    eyebrow: 'Kebijakan Mutu',
    title: 'Tanpa kompromi soal kualitas.',
    images: [
      { img: 'overhaul.jpg', alt: 'Tim IMM melakukan overhaul alat berat di lapangan' },
      { img: 'hero-boiler.jpg', alt: 'Pengecekan burner steam boiler' },
    ],
    points: ['Tepat waktu', 'Solusi custom', 'Upgrade & retrofit'],
    products: ['Tool & Die System', 'Product Tester', 'Wire Coiling System', 'Inspection System', 'Packaging System'],
  },

  clients: {
    eyebrow: 'Klien & Partner',
    title: 'Dipercaya 50+ perusahaan.',
    items: [
      'PT Fajar Mas Murni',
      'PT Turbo Diesel Intl',
      'PT Sinergi Oil',
      'PT Britoil',
      'PT Indokarya Energi',
      'PT Bandar Victory',
      'PT Senometal',
      'PT Oenggul Pipa Inspeksitama',
      'PT Amtek',
      'PT RTD / Java Velosi Mandiri',
      'PT Tropolis',
      'PT Advanced Offshore Serv',
      'PT Marcopolo',
      'PT JMS Batam',
      'PT Batamec',
      'PT Mitra Maritim Mandiri',
      'PT Citra Shipyard',
      'PT Sumber Marine Shipyard',
      'PT Indomarco Prismatama',
      'PT Rotary Engineering Indonesia',
      'PT Dharma Sentosa Marindo',
      'PT Destinasi Maritim Indonesia',
      'PT Soechi Indonesia',
      'PT Pancaran Maritim Transportindo',
    ],
    partners: [
      { name: 'Panasonic Industrial Devices', desc: 'Automation controls · Singapore' },
      { name: 'Mastool Precision Engineering', desc: 'Precision engineering · sejak 1986' },
    ],
  },

  contact: {
    eyebrow: 'Kontak',
    title: 'Mari bicara.',
    lead: 'Ceritakan kebutuhan proyek Anda.',
    persons: [
      { name: 'Nanang Supriyanto', role: 'Director', phone: '0813 7109 0660', href: 'tel:+6281371090660' },
      { name: 'Ariawati', role: 'FA & Procurement', phone: '0813 6400 2012', href: 'tel:+6281364002012' },
    ],
  },
};

// Gabungkan konten tersimpan dengan bawaan: bagian berupa objek digabung per field (field baru tetap punya nilai),
// bagian berupa daftar diganti utuh.
export function mergeContent(saved = {}) {
  const out = {};
  for (const [key, def] of Object.entries(defaultContent)) {
    const val = saved[key];
    if (val === undefined || val === null) out[key] = def;
    else if (Array.isArray(def)) out[key] = Array.isArray(val) ? val : def;
    else out[key] = { ...def, ...val };
  }
  return out;
}
