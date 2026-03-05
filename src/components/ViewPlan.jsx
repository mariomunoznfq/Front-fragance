import React, { useState } from 'react';

function ViewPlan({ onNext, onBack, setUserData }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customText, setCustomText] = useState('');

  // Hemos añadido 'desc' para que encaje con el estilo 'pill-text-group' de ViewLookAnalysis
  const plans = [
    { id: 'ia', label: 'PERSONALIZADO', icon: '🤖', desc: 'Define tu propio escenario con IA.' },
    { id: 'trabajo', label: 'TRABAJO', icon: '💼', desc: 'Oficina, reuniones y enfoque.' },
    { id: 'deporte', label: 'DEPORTE', icon: '⚡', desc: 'Gimnasio, aire libre y movimiento.' },
    { id: 'cita', label: 'CITA', icon: '❤️', desc: 'Encuentro especial, romance.' },
    { id: 'fiesta', label: 'FIESTA', icon: '✨', desc: 'Noche, música y energía.' },
  ];

  const handleContinue = () => {
    const finalValue = selectedPlan === 'ia' ? customText : plans.find(p => p.id === selectedPlan).label;
    setUserData(prev => ({ ...prev, plan: finalValue }));
    onNext(); 
  };

  const isButtonDisabled = !selectedPlan || (selectedPlan === 'ia' && customText.trim() === '');

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      
      {/* Luces de fondo (adaptadas del Look) */}
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onBack}>✕</button>
      </header>

      {/* Pestañas de progreso: Ahora PLAN es la activa */}
      <div className="progress-tabs">
        <div className="tab">ACTITUD</div>
        <div className="tab active" style={{ borderColor: 'var(--cyan-glow)', color: 'var(--cyan-glow)' }}>PLAN</div>
        <div className="tab">LOOK</div>
      </div>

      <div className="question-header">
        <h2>¿CUÁL ES EL <span className="text-glow" style={{ textShadow: '0 0 15px var(--cyan-glow)' }}>PLAN</span>?</h2>
        <p>Dinos dónde vas para ajustar la intensidad.</p>
      </div>

      {/* Lista de opciones usando el estilo 'glass-pill' */}
      <div className="options-cloud scrollable">
        {plans.map((plan) => (
          <button
            key={plan.id}
            className={`glass-pill pill-row ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
            style={selectedPlan === plan.id ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
          >
            <span className="pill-icon">{plan.icon}</span>
            <div className="pill-text-group" style={{ textAlign: 'left' }}>
              <span className="pill-title">{plan.label}</span>
              <span className="pill-desc">{plan.desc}</span>
            </div>
          </button>
        ))}

        {/* TARJETA IA: Adaptada para que parezca de cristal también */}
        {selectedPlan === 'ia' && (
          <div className="custom-input-card fade-in" style={{
            margin: '10px 0',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid var(--cyan-glow)',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
            padding: '15px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <textarea
              placeholder="Escribe aquí tu plan personalizado..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                resize: 'none',
                height: '60px',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
          </div>
        )}
      </div>

      {/* Footer doble (Atrás + Continuar) */}
      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack}>ATRÁS</button>
        <button 
          className={`btn-text ${!isButtonDisabled ? 'active' : ''}`}
          style={!isButtonDisabled ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : {}}
          onClick={!isButtonDisabled ? handleContinue : null}
        >
          CONTINUAR
        </button>
      </footer>
    </main>
  );
}

export default ViewPlan;