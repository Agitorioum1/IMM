import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Structure from './components/Structure.jsx';
import Services from './components/Services.jsx';
import Projects from './components/Projects.jsx';
import Quality from './components/Quality.jsx';
import Clients from './components/Clients.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
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
  );
}
