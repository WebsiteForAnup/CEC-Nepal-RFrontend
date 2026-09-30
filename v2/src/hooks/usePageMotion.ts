import { useEffect } from 'react';
export default function usePageMotion(pathname: string) {
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const root = document.querySelector('.cec-site');
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle('is-in-view', entry.isIntersecting),
        );
      },
      { threshold: 0.12 },
    );
    root
      .querySelectorAll('.cec-home > section, .cec-page-content > section, .cec-collection-card')
      .forEach((section) => observer.observe(section));
    root.classList.add('cec-motion-ready');
    return () => {
      observer.disconnect();
      root.classList.remove('cec-motion-ready');
    };
  }, [pathname]);
}
