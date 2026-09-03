import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Map from '../Map';
import GameCanvas from '../game/GameCanvas';
import HudRoot from '../ui/HUD/HudRoot';
import DialogBox from '../DialogBox';
import QuizModal from '../QuizModal';
import Certificate from '../Certificate';
import { useGameStore } from '../../store/useGameStore';
import './GameScreen.css';

/**
 * GameScreen — Tela principal de jogo (Etapa 2.3)
 *
 * Camadas (z-index crescente):
 *   1. Map          — grid de tiles + player + NPCs
 *   2. HudRoot      — HP bar e InteractionPrompt
 *   3. DialogBox    — caixa de diálogo GBA (z-index: 200)
 *   4. QuizModal    — modal de quiz     (z-index: 300)
 */
export default function GameScreen() {
  const gameCompleted = useGameStore((s) => s.gameCompleted);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const playerName = useGameStore((s) => s.playerName);

  return (
    <motion.div
      className="screen game-screen"
      style={{ position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {gameCompleted && (
        <Confetti
          recycle={false}
          numberOfPieces={400}
          style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 500 }}
        />
      )}
      {gameCompleted && !activeDialogue ? (
        <Certificate playerName={playerName} />
      ) : (
        <>
          <GameCanvas />
          <div className="game-react-map-layer">
            <Map />
          </div>
          <HudRoot />
          <DialogBox />
          <QuizModal />
        </>
      )}
    </motion.div>
  );
}
