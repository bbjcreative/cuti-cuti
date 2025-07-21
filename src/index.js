import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './tailwind.css'; // Ensure Tailwind CSS is imported

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Basic Service Worker registration for PWA - You'll need to create service-worker.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}