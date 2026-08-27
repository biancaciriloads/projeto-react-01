import SolUVEnemy from '../entities/enemies/SolUVEnemy';
import OleosidadeEnemy from '../entities/enemies/OleosidadeEnemy';
import BacteriaEnemy from '../entities/enemies/BacteriaEnemy';

/**
 * EnemyFactory
 *
 * Cria instâncias de inimigos dado um type string.
 * Mapa de strings → construtores — sem switch gigante, fácil de expandir.
 *
 * Para adicionar novo inimigo: importar classe e adicionar ao ENEMY_MAP.
 */
const ENEMY_MAP = {
  'sol-uv': SolUVEnemy,
  'oleosidade': OleosidadeEnemy,
  'bacteria': BacteriaEnemy,
};

/**
 * Cria e retorna uma instância de inimigo.
 *
 * @param {Phaser.Scene} scene
 * @param {string} type - 'sol-uv' | 'oleosidade' | 'bacteria'
 * @param {number} x
 * @param {number} y
 * @returns {import('../entities/enemies/BaseEnemy').default|null}
 */
export function createEnemy(scene, type, x, y) {
  const Ctor = ENEMY_MAP[type];
  if (!Ctor) {
    console.warn(`[EnemyFactory] Tipo de inimigo desconhecido: "${type}"`);
    return null;
  }
  return new Ctor(scene, x, y);
}
