import React, { useState } from 'react';

function ViewPlan({ onNext, onBack, setUserData }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { icon: '💼', title: 'TRABAJO', desc: 'Oficina, reuniones o coworking.' },
    { icon: '💕', title: 'CITA ROMÁNTICA', desc: 'Cena íntima o paseo especial.' },
    { icon: '🏠', title: 'EN CASITA', desc: 'Sofá, manta y relax.' },
    { icon: '💪', title: 'GYM', desc: 'Entrenamiento y deporte.' },
    { icon: '🎉', title: 'FIESTA', desc: 'Noche larga y diversión.' },
    { icon: '✨', title: 'PERSONALIZADO', desc: 'Dile a la IA qué vas a hacer hoy.', isCustom: true }
  ];

  const handleContinue = () => {
    if (selectedPlan) {
      setUserData(prev => ({ ...prev, plan: selectedPlan }));
      // Como no tenemos pantalla 4 todavía, ponemos el alert
      alert(`¡Datos guardados en el estado de React!\nPlan elegido: ${selectedPlan}`);
    }
  };

  return (
    <main className="view-ethereal fade-in">
      <div className="flare flare-3"></div>
      <div className="flare flare-4"></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon">✕</button>
      </header>

      <div className="progress-tabs">
        <div className="tab">ACTITUD</div>
        <div className="tab active">PLAN</div>
        <div className="tab">LOOK</div>
      </div>

      <div className="question-header">
        <h2>¿QUÉ <span className="text-glow">PLAN</span> TIENES HOY?</h2>
        <p>Elige tu destino o descríbelo.</p>
      </div>

      <div className="options-cloud scrollable">
        {plans.map((item) => (
          <button 
            key={item.title}
            className={`glass-pill pill-row ${item.isCustom ? 'custom-glow' : ''} ${selectedPlan === item.title ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(item.title)}
          >
            <span className="pill-icon">{item.icon}</span>
            <div className="pill-text-group">
              <span className="pill-title">{item.title}</span>
              <span className="pill-desc">{item.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack}>ATRÁS</button>
        <button 
          className={`btn-text ${selectedPlan ? 'active' : ''}`} 
          onClick={handleContinue}
        >
          CONTINUAR
        </button>
      </footer>
    </main>
  );
}

export default ViewPlan;