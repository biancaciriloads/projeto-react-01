import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { gerarGrid, tileEhCaminhavel } from '../../data/mapData';
import { NPCS } from '../../data/mapData';

const TECLAS_DIRECAO = {
  w: { dx: 0, dy: -1, dir: 'cima' },
  ArrowUp: { dx: 0, dy: -1, dir: 'cima' },
  s: { dx: 0, dy: 1, dir: 'baixo' },
  ArrowDown: { dx: 0, dy: 1, dir: 'baixo' },
  a: { dx: -1, dy: 0, dir: 'esquerda' },
  ArrowLeft: { dx: -1, dy: 0, dir: 'esquerda' },
  d: { dx: 1, dy: 0, dir: 'direita' },
  ArrowRight: { dx: 1, dy: 0, dir: 'direita' },
};

const COOLDOWN_MS = 130;

// Hook responsável pela movimentação em grid do personagem, com colisão
// contra paredes e contra NPCs (que ocupam seu próprio tile).
export default function useMovement({ ativo }) {
  const grid = useRef(null);
  if (!grid.current) grid.current = gerarGrid();

  const teclasPressionadas = useRef(new Set());
  const ultimoMovimento = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (TECLAS_DIRECAO[e.key]) teclasPressionadas.current.add(e.key);
    }
    function onKeyUp(e) {
      teclasPressionadas.current.delete(e.key);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    function loop(t) {
      if (ativo && t - ultimoMovimento.current > COOLDOWN_MS) {
        const teclaAtiva = [...teclasPressionadas.current][0];
        const mov = teclaAtiva && TECLAS_DIRECAO[teclaAtiva];
        if (mov) {
          const { posicao, setPosicao, setDirecao } = useGameStore.getState();
          setDirecao(mov.dir);
          const novoX = posicao.x + mov.dx;
          const novoY = posicao.y + mov.dy;
          const ocupadoPorNpc = NPCS.some((n) => n.pos.x === novoX && n.pos.y === novoY);
          if (tileEhCaminhavel(grid.current, novoX, novoY) && !ocupadoPorNpc) {
            setPosicao({ x: novoX, y: novoY });
            ultimoMovimento.current = t;
          }
        }
      }
      frameRef.current = requestAnimationFrame(loop);
    }
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [ativo]);
}
