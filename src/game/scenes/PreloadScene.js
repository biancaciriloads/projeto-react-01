import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { getAllManifestEntries } from '../data/assetManifest';
import { gameEventBus } from '../events/GameEventBus';

/**
 * PreloadScene
 *
 * Carrega todos os assets registrados em `assetManifest.js` e reporta o
 * progresso ao React através do GameEventBus (a LoadingScreen escuta
 * 'preload:progress' para animar a barra de carregamento).
 */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload() {
    const { spritesheets, images } = getAllManifestEntries();

    spritesheets.forEach(({ key, path, frameWidth, frameHeight }) => {
      this.load.spritesheet(key, path, { frameWidth, frameHeight });
    });

    images.forEach(({ key, path }) => {
      this.load.image(key, path);
    });

    this.load.on('progress', (value) => {
      gameEventBus.emit('preload:progress', { progress: value });
    });
  }

  create() {
    gameEventBus.emit('preload:complete');
    this.scene.start(SCENE_KEYS.CLINICA_01);
  }
}
