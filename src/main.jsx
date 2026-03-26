import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './styles/index.css'

// 1. Importar la librería de Google Analytics
import ReactGA from "react-ga4";

// 2. Inicializar con tu ID de medición
ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// 3. Registrar la primera visita nada más cargar la app
ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Inicio In Essence" });

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)