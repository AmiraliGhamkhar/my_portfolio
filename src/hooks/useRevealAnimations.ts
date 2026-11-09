import { useLayoutEffect } from 'react';

export function useRevealAnimations(scopeKey: string) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-page-root]');
    if (!root) return;
    let active = true;
    let revert = () => {};

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (!active) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const context = gsap.context(() => {
        const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
        if (reducedMotion) {
          gsap.set(elements, { clearProps: 'all' });
          return;
        }

        elements.forEach((element, index) => {
          gsap.fromTo(element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              delay: Math.min(index % 3, 2) * 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
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
    });

    return () => { active = false; revert(); };
  }, [scopeKey]);
}
