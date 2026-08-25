import React from 'react';
import { usePhaserGame } from '../../hooks/usePhaserGame';
import './GameCanvas.css';

/**
 * GameCanvas
 *
 * Único componente React que toca no Phaser. Apenas hospeda o elemento
 * DOM onde o canvas é injetado — todo o desenho do jogo em si acontece
 * dentro das Scenes do Phaser, nunca aqui.
 */
export default function GameCanvas() {
  const containerRef = usePhaserGame();

  return <div ref={containerRef} className="game-canvas" />;
}
