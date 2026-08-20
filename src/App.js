import React, { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = ['🎉', '🌟', '🔥', '💎', '🎯', '🚀', '🌈', '🍀'];
const TOTAL_PAIRS = EMOJIS.length;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [cartas, setCartas] = useState(() => {
    const pares = [...EMOJIS, ...EMOJIS];
    return shuffle(pares).map((emoji, id) => ({ id, emoji, virada: false, combinada: false }));
  });
  const [selecionadas, setSelecionadas] = useState([]);
  const [movimentos, setMovimentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [venceu, setVenceu] = useState(false);
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => setTema(tema === 'light' ? 'dark' : 'light');

  useEffect(() => {
    if (selecionadas.length === 2) {
      setBloqueado(true);
      const [a, b] = selecionadas;
      if (cartas[a].emoji === cartas[b].emoji) {
        setCartas(prev =>
          prev.map(c => (c.id === cartas[a].id || c.id === cartas[b].id ? { ...c, combinada: true } : c))
        );
        setSelecionadas([]);
        setBloqueado(false);
      } else {
        setTimeout(() => {
          setCartas(prev =>
            prev.map(c => (c.id === cartas[a].id || c.id === cartas[b].id ? { ...c, virada: false } : c))
          );
          setSelecionadas([]);
          setBloqueado(false);
        }, 900);
      }
    }
  }, [selecionadas, cartas]);

  useEffect(() => {
    if (cartas.length > 0 && cartas.every(c => c.combinada)) {
      setVenceu(true);
    }
  }, [cartas]);

  const handleClick = (index) => {
    if (bloqueado) return;
    if (cartas[index].virada || cartas[index].combinada) return;
    if (selecionadas.length === 2) return;

    setCartas(prev => prev.map((c, i) => (i === index ? { ...c, virada: true } : c)));
    setSelecionadas(prev => [...prev, index]);
    setMovimentos(m => m + 1);
  };

  const reiniciar = () => {
    const pares = [...EMOJIS, ...EMOJIS];
    setCartas(shuffle(pares).map((emoji, id) => ({ id, emoji, virada: false, combinada: false })));
    setSelecionadas([]);
    setMovimentos(0);
    setVenceu(false);
    setBloqueado(false);
  };

  return (
    <div className="page-container">
      <button className="theme-toggle" onClick={alternarTema} aria-label="Alternar tema" title={tema === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}>
        {tema === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="glass-card">
        {!venceu ? (
          <div>
            <h1 className="titulo">Jogo da Memória</h1>
            <p className="subtitulo">Movimentos: <strong>{movimentos}</strong></p>
            <div className="grid-memoria">
              {cartas.map((carta, i) => (
                <button
                  key={carta.id}
                  onClick={() => handleClick(i)}
                  className={`carta ${carta.virada || carta.combinada ? 'virada' : ''} ${carta.combinada ? 'combinada' : ''}`}
                  disabled={carta.combinada}
                >
                  <span className="carta-frente">{carta.emoji}</span>
                  <span className="carta-verso">?</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h1 className="titulo">🎉 Parabéns!</h1>
            <p className="subtitulo">Você completou o jogo em <strong>{movimentos}</strong> movimentos!</p>
            <button onClick={reiniciar} className="botao-primario">Jogar Novamente 🔄</button>
          </div>
        )}
      </div>
    </div>
  );
}
