import Phaser from 'phaser';
import { createPhaserConfig } from './config/phaserConfig';

/**
 * Cria uma nova instância do Phaser.Game dentro do elemento `parent`.
 * Usado exclusivamente pelo hook `usePhaserGame` — nenhum outro lugar do
 * React deve instanciar Phaser diretamente.
 */
export function createPhaserGame(parent) {
  return new Phaser.Game(createPhaserConfig(parent));
}

/** Destrói a instância com segurança (chamado no cleanup do useEffect). */
export function destroyPhaserGame(gameInstance) {
  if (gameInstance) {
    gameInstance.destroy(true);
  }
}
