import { company } from '../data.js';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <span>
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </span>
        <nav>
          <a href="#tentang">Tentang</a>
          <a href="#layanan">Layanan</a>
          <a href="#kontak">Kontak</a>
        </nav>
      </div>
    </footer>
  );
}
