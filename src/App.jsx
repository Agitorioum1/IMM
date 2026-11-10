import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Structure from './components/Structure.jsx';
import Services from './components/Services.jsx';
import ServiceDetail from './components/ServiceDetail.jsx';
import Projects from './components/Projects.jsx';
import Quality from './components/Quality.jsx';
import Clients from './components/Clients.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { ContentProvider } from './content.jsx';
import { usePath } from './router.jsx';

// Panel admin dimuat terpisah supaya tidak menambah ukuran halaman utama
const Admin = lazy(() => import('./admin/Admin.jsx'));

// Saat pindah halaman: lompat ke #bagian bila ada, selain itu ke atas.
// Dirender di dalam ContentProvider supaya baru jalan setelah konten (dan bagian tujuannya) tampil.
function ScrollOnNavigate({ path }) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = hash && document.getElementById(hash);
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path]);
  return null;
}

export default function App() {
  const path = usePath();
  const serviceSlug = path.match(/^\/layanan\/([^/]+)\/?$/)?.[1];

  if (/^\/admin\/?$/.test(path)) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <ContentProvider>
      <ScrollOnNavigate path={path} />
      {serviceSlug ? (
        <ServiceDetail slug={serviceSlug} />
      ) : (
        <>
          <Navbar />
          <main id="top">
            <Hero />
            <Marquee />
            <About />
            <Structure />
            <Services />
            <Projects />
            <Quality />
            <Clients />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </ContentProvider>
  );
}
