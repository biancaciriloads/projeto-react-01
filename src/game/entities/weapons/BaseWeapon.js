import { WEAPON_STATS } from '../../../constants/weaponSettings';

/**
 * BaseWeapon
 *
 * Classe abstrata que define o contrato de todas as armas.
 * Cada subclasse implementa `_doFire(originX, originY, dirX, dirY)`.
 *
 * Padrão Template Method: `fire()` verifica cooldown → chama `_doFire`.
 */
export default class BaseWeapon {
  /**
   * @param {Phaser.Scene} scene
   * @param {object} owner - entidade dona da arma (Player)
   * @param {string} weaponId - chave em WEAPON_STATS
   * @param {import('../../../game/systems/ProjectilePool').default} pool
   */
  constructor(scene, owner, weaponId, pool) {
    const stats = WEAPON_STATS[weaponId];
    if (!stats) throw new Error(`[BaseWeapon] Arma desconhecida: "${weaponId}"`);

    this.scene = scene;
    this.owner = owner;
    this.weaponId = weaponId;
    this.pool = pool;

    this.damage = stats.damage;
    this.fireRate = stats.fireRate;
    this.projectileSpeed = stats.projectileSpeed;
    this.range = stats.range;
    this.effectType = stats.effectType;

    this.lastFiredAt = 0;
  }

  /** True se o cooldown já passou. */
  canFire() {
    return this.scene.time.now - this.lastFiredAt >= this.fireRate;
  }

  /**
   * Tenta disparar. Só efetiva se `canFire()` retornar true.
   * @param {number} originX
   * @param {number} originY
   * @param {number} dirX - componente horizontal da direção (-1 | 1)
   * @param {number} dirY - componente vertical (0 em disparos horizontais)
   */
  fire(originX, originY, dirX, dirY) {
    if (!this.canFire()) return;
    this.lastFiredAt = this.scene.time.now;
    this._doFire(originX, originY, dirX, dirY);
  }

  /**
   * Implementado pelas subclasses.
   * @abstract
   */
  _doFire(_originX, _originY, _dirX, _dirY) {
    throw new Error(`[BaseWeapon] _doFire() não implementado em ${this.constructor.name}`);
  }

  /** Hook para atualizações por frame (sobrescrito se necessário). */
  update(_delta) {}
}
