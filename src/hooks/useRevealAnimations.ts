import { useLayoutEffect } from 'react';

const REVEAL_FLAG = 'js-reveal';
const FALLBACK_DELAY = 2000;

export function useRevealAnimations(scopeKey: string) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-page-root]');
    if (!root) return;
    let active = true;
    let revert = () => {};

    // If the animation chunk never arrives, make every reveal target visible again.
    const fallback = window.setTimeout(() => document.documentElement.classList.remove(REVEAL_FLAG), FALLBACK_DELAY);

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (!active) return;
      window.clearTimeout(fallback);
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const context = gsap.context(() => {
        const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
        if (reducedMotion) {
          document.documentElement.classList.remove(REVEAL_FLAG);
          gsap.set(elements, { clearProps: 'all' });
          return;
        }

        elements.forEach((element, index) => {
          gsap.fromTo(element,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              delay: Math.min(index % 3, 2) * 0.05,
              ease: 'power3.out',
              clearProps: 'transform,visibility',
              scrollTrigger: { trigger: element, start: 'top 90%', once: true },
            },
          );
        });

        const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
        if (progress) {
          gsap.fromTo(progress, { scaleX: 0 }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.15 },
          });
        }
      }, root);
      revert = () => context.revert();
    }).catch(() => {
      // Motion is progressive enhancement; content remains visible if the animation chunk fails.
      document.documentElement.classList.remove(REVEAL_FLAG);
    });

    return () => { active = false; window.clearTimeout(fallback); revert(); };
  }, [scopeKey]);
}
