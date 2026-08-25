import { useEffect, useRef } from 'react';
import { createPhaserGame, destroyPhaserGame } from '../game/PhaserGame';
import { gameEventBus } from '../game/events/GameEventBus';
import { useGameSessionStore } from '../store/useGameSessionStore';

/**
 * usePhaserGame
 *
 * Monta uma instância do Phaser.Game dentro do elemento referenciado por
 * `containerRef` quando o componente entra em tela, e destrói com
 * segurança quando sai — evita vazar múltiplas instâncias em re-renders
 * do React (StrictMode monta/desmonta componentes duas vezes em dev).
 *
 * Também assina o GameEventBus para refletir progresso de carregamento
 * e transições de tela na store do React.
 */
export function usePhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  const setLoadProgress = useGameSessionStore((s) => s.setLoadProgress);
  const enterGame = useGameSessionStore((s) => s.enterGame);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined;

    gameRef.current = createPhaserGame(containerRef.current);

    const offProgress = gameEventBus.on('preload:progress', ({ progress }) => {
      setLoadProgress(progress);
    });

    const offReady = gameEventBus.on('level:ready', () => {
      enterGame();
    });

    return () => {
      offProgress();
      offReady();
      destroyPhaserGame(gameRef.current);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
