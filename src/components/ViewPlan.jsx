import React, { useState } from 'react';

function ViewPlan({ onNext, onBack, setUserData }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customText, setCustomText] = useState('');

  const plans = [
    { id: 'ia', label: 'PERSONALIZADO', desc: 'Define tu propio escenario con IA.' },
    { id: 'trabajo', label: 'TRABAJO', desc: 'Oficina, reuniones y enfoque.' },
    { id: 'deporte', label: 'DEPORTE',  desc: 'Gimnasio, aire libre y movimiento.' },
    { id: 'cita', label: 'CITA', desc: 'Encuentro especial, romance.' },
    { id: 'fiesta', label: 'FIESTA', desc: 'Noche, música y energía.' },
  ];

  const handleContinue = () => {
    const finalValue = selectedPlan === 'ia' ? customText : plans.find(p => p.id === selectedPlan).label;
    setUserData(prev => ({ ...prev, plan: finalValue }));
    onNext(); 
  };

  // AQUÍ ESTÁ EL PRIMER CAMBIO: Validamos que tenga entre 3 y 100 caracteres
  const isButtonDisabled = !selectedPlan || (selectedPlan === 'ia' && (customText.trim().length < 3 || customText.trim().length > 100));

  return (
    <main className="zara-view-analysis fade-in">
      
      {/* Header Limpio */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      {/* Pestañas de progreso: Ahora PLAN es la activa */}
      <div className="zara-tabs">
        <div className="zara-tab">Actitud</div>
        <div className="zara-tab active">Plan</div>
        <div className="zara-tab">Look</div>
      </div>

      {/* Título de la sección */}
      <div className="zara-title-container">
        <h2 className="zara-title">¿Cuál es el plan?</h2>
        <p className="zara-subtitle">Dinos dónde vas para ajustar la intensidad.</p>
      </div>

      {/* Lista de opciones (Estilo Grid de Zara) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div className="zara-grid">
          {plans.map((plan) => (
            <div key={plan.id} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <button
                className={`zara-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <span style={{ fontSize: '1.5rem' }}>{plan.icon}</span>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '4px' }}>{plan.label}</div>
                  <div className="zara-card-desc">{plan.desc}</div>
                </div>
              </button>

              {/* TARJETA IA: Textarea limpio, cuadrado y minimalista */}
              {selectedPlan === 'ia' && plan.id === 'ia' && (
                <div className="fade-in" style={{
                  marginTop: '-1px', // Para que se pegue al botón de arriba
                  border: '1px solid #000000',
                  borderTop: 'none',
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <textarea
                    placeholder="Escribe aquí tu plan personalizado..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    // AQUÍ ESTÁ EL SEGUNDO CAMBIO: Límites en el input
                    minLength={3}
                    maxLength={100}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: '#000000',
                      outline: 'none',
                      resize: 'none',
                      height: '60px',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit',
                      letterSpacing: '1px'
                    }}
                  />
                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Botones de Acción */}
      <footer className="zara-footer-analysis">
        <button className="zara-btn-back" onClick={onBack}>
          ATRÁS
        </button>
        <button 
          className="zara-btn-next" 
          onClick={handleContinue}
          disabled={isButtonDisabled}
        >
          CONTINUAR
        </button>
      </footer>
    </main>
  );
}

export default ViewPlan;