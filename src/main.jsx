import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './styles/index.css';
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

ReactGA.send({
  hitType: 'pageview',
  page: window.location.pathname,
  title: 'Inicio In Essence',
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
