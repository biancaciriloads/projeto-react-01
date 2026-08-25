import React from 'react';
import { motion } from 'framer-motion';
import GameCanvas from '../game/GameCanvas';
import './GameScreen.css';

/**
 * GameScreen
 *
 * Envolve o GameCanvas e reserva o espaço onde o HUD (moedas, vida,
 * inventário) será montado em uma etapa futura. Nenhum HUD é renderizado
 * ainda, conforme escopo desta fase.
 */
export default function GameScreen() {
  return (
    <motion.div
      className="screen game-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GameCanvas />
      {/* <Hud /> — reservado para uma próxima etapa */}
    </motion.div>
  );
}
