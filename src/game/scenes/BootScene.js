import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';

/**
 * BootScene
 *
 * Primeira cena executada. Não carrega assets do jogo — apenas prepara
 * configurações mínimas do renderer (ex.: pixelArt) e passa o bastão para
 * o PreloadScene, que faz o carregamento real com barra de progresso.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  create() {
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
