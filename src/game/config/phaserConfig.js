import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PHYSICS } from '../../constants/gameSettings';
import BootScene from '../scenes/BootScene';
import PreloadScene from '../scenes/PreloadScene';
import Clinica01Scene from '../scenes/Clinica01Scene';

/**
 * Gera a configuração do Phaser.Game.
 *
 * `parent` é o id (ou elemento) do container React onde o canvas será
 * injetado — ver `hooks/usePhaserGame.js`.
 */
export function createPhaserConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    backgroundColor: '#1b1f2a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: PHYSICS.GRAVITY_Y },
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, Clinica01Scene],
  };
}
