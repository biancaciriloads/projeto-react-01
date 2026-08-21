import { useEffect, useState } from 'react';
import { NPCS } from '../../data/mapData';

const RAIO_INTERACAO = 1; // distância máxima (em tiles) para poder interagir

function distancia(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

// Retorna o NPC mais próximo do jogador (dentro do raio de interação) e
// dispara `onInteragir(npc)` quando a tecla X é pressionada.
export default function useProximity(posicaoJogador, ativo, onInteragir) {
  const [npcProximo, setNpcProximo] = useState(null);

  useEffect(() => {
    const proximo = NPCS.find((npc) => distancia(npc.pos, posicaoJogador) <= RAIO_INTERACAO);
    setNpcProximo(proximo || null);
  }, [posicaoJogador]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!ativo) return;
      if ((e.key === 'x' || e.key === 'X') && npcProximo) {
        onInteragir(npcProximo);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ativo, npcProximo, onInteragir]);

  return npcProximo;
}
