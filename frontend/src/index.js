import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 18 rendering
if (ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Fallback for older React versions
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}