import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/manrope';
import '@fontsource-variable/vazirmatn';
import './styles.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);
