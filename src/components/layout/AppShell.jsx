import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameSessionStore, VIEWS } from '../../store/useGameSessionStore';
import StartScreen from '../screens/StartScreen';
import LoadingScreen from '../screens/LoadingScreen';
import GameScreen from '../screens/GameScreen';
import './AppShell.css';

/**
 * AppShell
 *
 * Decide qual tela React mostrar. Importante: o GameScreen (e, dentro
 * dele, o Phaser) é montado UMA ÚNICA VEZ assim que o jogador clica em
 * "Jogar" e permanece montado durante o loading e o jogo — assim o
 * carregamento de assets acontece em paralelo à barra de progresso, sem
 * criar/destruir a instância do Phaser mais de uma vez.
 *
 * A transição de LOADING -> PLAYING acontece via evento do próprio jogo
 * (ver hooks/usePhaserGame.js -> 'level:ready'), não por tempo simulado.
 */
export default function AppShell() {
  const view = useGameSessionStore((s) => s.view);
  const hasStartedGame = view === VIEWS.LOADING || view === VIEWS.PLAYING;

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">{view === VIEWS.START && <StartScreen key="start" />}</AnimatePresence>

      {hasStartedGame && <GameScreen />}

      <AnimatePresence>{view === VIEWS.LOADING && <LoadingScreen key="loading" />}</AnimatePresence>
    </div>
  );
}
