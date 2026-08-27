import MicroagulhamentoWeapon from '../entities/weapons/MicroagulhamentoWeapon';
import LaserEsteticoWeapon from '../entities/weapons/LaserEsteticoWeapon';
import ChicoteRadiofrequenciaWeapon from '../entities/weapons/ChicoteRadiofrequenciaWeapon';
import SprayCriogenicoWeapon from '../entities/weapons/SprayCriogenicoWeapon';
import PlasmaPenWeapon from '../entities/weapons/PlasmaPenWeapon';

/**
 * WeaponFactory
 *
 * Cria instâncias de armas dado um weaponId.
 * Mapa de strings → construtores: sem switch gigante, facilmente extensível.
 */
const WEAPON_MAP = {
  'microagulhamento': MicroagulhamentoWeapon,
  'laser-estetico': LaserEsteticoWeapon,
  'chicote-radiofrequencia': ChicoteRadiofrequenciaWeapon,
  'spray-criogenico': SprayCriogenicoWeapon,
  'plasma-pen': PlasmaPenWeapon,
};

/**
 * Cria e retorna uma instância de arma.
 *
 * @param {Phaser.Scene} scene
 * @param {object} owner - dono da arma (Player)
 * @param {string} weaponId - ID da arma (ver WEAPON_STATS em weaponSettings.js)
 * @param {import('./ProjectilePool').default} pool - pool de projéteis compartilhado
 * @param {Phaser.GameObjects.Group} [enemyGroup] - necessário apenas para chicote (melee)
 * @returns {import('../entities/weapons/BaseWeapon').default|null}
 */
export function createWeapon(scene, owner, weaponId, pool, enemyGroup = null) {
  const Ctor = WEAPON_MAP[weaponId];
  if (!Ctor) {
    console.warn(`[WeaponFactory] weaponId desconhecido: "${weaponId}"`);
    return null;
  }
  // ChicoteRadiofrequencia precisa do enemyGroup para detecção de hit
  if (weaponId === 'chicote-radiofrequencia') {
    return new Ctor(scene, owner, pool, enemyGroup);
  }
  return new Ctor(scene, owner, pool);
}
