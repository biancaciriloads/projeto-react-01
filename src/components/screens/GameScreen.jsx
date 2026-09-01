import React from 'react';
import { motion } from 'framer-motion';
import GameCanvas from '../game/GameCanvas';
import HudRoot from '../ui/HUD/HudRoot';
import './GameScreen.css';

/**
 * GameScreen
 *
 * Envolve o GameCanvas e renderiza o HUD (overlay React)
 * por cima da tela do jogo.
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
      <GameCanvas />
      <HudRoot />
    </motion.div>
  );
}
