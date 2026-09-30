import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');
hydrateRoot(root, <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
