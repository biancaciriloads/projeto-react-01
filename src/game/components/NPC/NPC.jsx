import React from 'react';
import { gridParaIso } from '../../data/mapData';

export default function NPC({ npc, mostrarPrompt }) {
  const { left, top } = gridParaIso(npc.pos.x, npc.pos.y);

  return (
    <div className="npc-wrapper" style={{ left, top }}>
      <div className="personagem-sprite npc-sprite">
        <div className="parte cabelo" style={{ background: '#2b1b12' }} />
        <div className="parte cabeca" style={{ background: '#f0c9a0' }} />
        <div className="parte torso" style={{ background: npc.cor }} />
        <div className="parte pernas" style={{ background: '#343a40' }} />
        <div className="parte pes" style={{ background: '#2b2b2b' }} />
      </div>
      <div className="npc-nome">{npc.isEspelho ? npc.nome : npc.nome}</div>
      {mostrarPrompt && <div className="npc-prompt">Aperte X para {npc.isEspelho ? 'ver o espelho' : 'conversar'}</div>}
    </div>
  );
}
