// client/src/index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Завантаження перекладів...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);

reportWebVitals();