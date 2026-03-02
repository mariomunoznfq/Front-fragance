import React, { useState } from 'react';

function ViewAttitude({ onNext, onClose, setUserData }) {
  // Estado local para saber qué píldora ha tocado el usuario
  const [selectedAttitude, setSelectedAttitude] = useState(null);

  // Nuestra lista de opciones (así el código queda súper limpio)
  const attitudes = [
    { title: 'SEGURIDAD', desc: 'Confianza y autoridad.' },
    { title: 'RELAJACIÓN', desc: 'Naturalidad y comodidad.' },
    { title: 'SOFISTICACIÓN', desc: 'Elegancia y refinamiento.' },
    { title: 'ATREVIMIENTO', desc: 'Creatividad y audacia.' },
    { title: 'COQUETERÍA', desc: 'Misterio y seducción.' },
    { title: 'ENERGÍA', desc: 'Vitalidad y dinamismo.' }
  ];

  // Función para avanzar
  const handleContinue = () => {
    if (selectedAttitude) {
      // Guardamos la elección en la mochila de App.jsx
      setUserData(prev => ({ ...prev, attitude: selectedAttitude }));
      // Pasamos a la siguiente pantalla
      onNext();
    }
  };

  return (
    <main className="view-ethereal fade-in">
      <div className="flare flare-1"></div>
      <div className="flare flare-2"></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </header>

      <div className="progress-tabs">
        <div className="tab active">ACTITUD</div>
        <div className="tab">PLAN</div>
        <div className="tab">LOOK</div>
      </div>

      <div className="question-header">
        <h2>¿QUÉ <span className="text-glow">PROYECTAS</span> HOY?</h2>
        <p>Define tu aura para hoy.</p>
      </div>

      <div className="options-cloud">
        {/* Recorremos la lista y pintamos una píldora por cada una */}
        {attitudes.map((item) => (
          <button 
            key={item.title}
            // Si coincide con la seleccionada, le añadimos la clase 'selected'
            className={`glass-pill ${selectedAttitude === item.title ? 'selected' : ''}`}
            onClick={() => setSelectedAttitude(item.title)}
          >
            <span className="pill-title">{item.title}</span>
            <span className="pill-desc">{item.desc}</span>
          </button>
        ))}
      </div>

      <footer className="footer-dark">
        <button 
          // El botón solo se ilumina si hay algo seleccionado
          className={`btn-text ${selectedAttitude ? 'active' : ''}`} 
          onClick={handleContinue}
        >
          DESCUBRIR
        </button>
      </footer>
    </main>
  );
}

export default ViewAttitude;