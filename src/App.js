import React, { useEffect, useState } from 'react';
import './App.css';
import './game/game.css';
import GameRoot from './game/GameRoot';

export default function App() {
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => setTema((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <>
      <button
        className="theme-toggle"
        onClick={alternarTema}
        aria-label="Alternar tema"
        title={tema === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        style={{ zIndex: 20 }}
      >
        {tema === 'light' ? '🌙' : '☀️'}
      </button>
      <GameRoot />
    </>
  );
}
