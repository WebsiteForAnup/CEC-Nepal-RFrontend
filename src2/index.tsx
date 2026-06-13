import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import siteConfig from './data/global/site-config.json';
import { initGA } from './utils/analytics';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import { authClient } from './lib/auth';


// Initialize Google Analytics
initGA();

// Dynamically set favicon from company data
const favicon = siteConfig.assets?.favicon;
if (favicon) {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = favicon;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <NeonAuthUIProvider emailOTP authClient={authClient}>
      <App />
    </NeonAuthUIProvider>
  </React.StrictMode>
);
