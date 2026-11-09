import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/manrope';
import '@fontsource-variable/vazirmatn';
import './styles.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

// Hide reveal targets before the animation chunk loads, but only when motion is
// welcome. A timer in useRevealAnimations removes this class if the chunk fails,
// so content never stays hidden.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-reveal');
}

const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);
