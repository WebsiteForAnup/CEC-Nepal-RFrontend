import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import siteConfig from './data/global/site-config.json';

// Dynamically set favicon from company data
const favicon = siteConfig.assets?.favicon;
if (favicon) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = favicon;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
