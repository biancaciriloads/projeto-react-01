import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ORDEM_SALAS } from '../../data/quizData';

export default function HUD() {
  const moedas = useGameStore((s) => s.moedas);
  const salasConcluidas = useGameStore((s) => s.salasConcluidas);
  const perguntasRespondidas = useGameStore((s) => s.perguntasRespondidas);
  const equipado = useGameStore((s) => s.equipado);

  const itensEquipados = Object.values(equipado).filter(Boolean).length;

  return (
    <div className="hud">
      <div className="hud-item" title="Moedas">🪙 {moedas}</div>
      <div className="hud-item" title="Salas concluídas">🏥 {salasConcluidas.length}/{ORDEM_SALAS.length}</div>
      <div className="hud-item" title="Perguntas respondidas">📝 {perguntasRespondidas}</div>
      <div className="hud-item" title="Itens equipados">👕 {itensEquipados}</div>
    </div>
  );
}
