import React from 'react';

function ViewHome({ userName, onNext }) {
  return (
    <main className="view-home fade-in">
      <header className="header-light">
        <h1 className="logo-text"><strong>IN</strong> ESSENCE AI</h1>
      </header>

      <div className="center-stage">
        <div className="greeting-texts">
          <h2 className="text-morning">Buenos días</h2>

          <h3 className="text-name">{userName ? userName.toUpperCase() : 'INVITADA'}</h3>
          <p className="text-question">¿Qué perfume usamos hoy?</p>
        </div>
      </div>
      
      <footer className="footer-light">
        
        <button className="btn-ghost" onClick={onNext}>
          Descubrir mi fragancia
        </button>
      </footer>
    </main>
  );
}

export default ViewHome;