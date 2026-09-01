import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../../constants/gameSettings';
import BootScene from '../scenes/BootScene';
import PreloadScene from '../scenes/PreloadScene';
import Clinica01Scene from '../scenes/Clinica01Scene';
import ClinicaTDScene from '../scenes/ClinicaTDScene';

/**
 * Gera a configuracao do Phaser.Game.
 *
 * `parent` e o id (ou elemento) do container React onde o canvas sera
 * injetado — ver `hooks/usePhaserGame.js`.
 *
 * NOTA: A fisica arcade e configurada com gravity.y = 0 por padrao para
 * suportar a cena top-down. A Clinica01Scene (side-scroller) redefine
 * a gravidade localmente via physics.world.gravity.
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
        gravity: { y: 0 },   // top-down por padrao; Clinica01Scene define y=PHYSICS.GRAVITY_Y
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, ClinicaTDScene, Clinica01Scene],
  };
}
