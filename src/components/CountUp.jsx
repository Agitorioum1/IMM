import { useEffect, useRef, useState } from 'react';

// Angka menghitung naik dari 0 saat pertama kali terlihat.
export default function CountUp({ to, duration = 1400 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || !('IntersectionObserver' in window)) {
      setValue(to);
      return;
    }
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return <span ref={ref}>{value}</span>;
}
