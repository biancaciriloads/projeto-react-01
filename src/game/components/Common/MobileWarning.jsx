import React from 'react';

export default function MobileWarning() {
  return (
    <div className="page-container">
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h1 className="titulo">📱➡️💻</h1>
        <p className="pergunta-texto">
          A Clínica Estética Master é um minigame de exploração feito para telas maiores.
        </p>
        <p style={{ color: 'var(--muted)' }}>
          Para a melhor experiência, acesse esta página em um computador (desktop/notebook).
        </p>
      </div>
    </div>
  );
}
