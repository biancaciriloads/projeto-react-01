import React from 'react';
import { motion } from 'framer-motion';
import Map from '../Map';
import HudRoot from '../ui/HUD/HudRoot';
import DialogBox from '../DialogBox';
import QuizModal from '../QuizModal';
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
  return (
    <motion.div
      className="screen game-screen"
      style={{ position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Map />
      <HudRoot />
      <DialogBox />
      <QuizModal />
    </motion.div>
  );
}
