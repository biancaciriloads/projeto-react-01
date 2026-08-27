import BaseWeapon from './BaseWeapon';

/**
 * LaserEsteticoWeapon
 *
 * Dispara um feixe de laser reto em alta velocidade.
 * Longo alcance, dano médio, cadência baixa.
 */
export default class LaserEsteticoWeapon extends BaseWeapon {
  constructor(scene, owner, pool) {
    super(scene, owner, 'laser-estetico', pool);
  }

  _doFire(originX, originY, dirX, _dirY) {
    const p = this.pool.acquire(originX, originY, {
      damage: this.damage,
      range: this.range,
      effectType: this.effectType,
      color: 0x00ffff, // ciano — laser
    });
    if (!p) return;
    p.body.setVelocity(dirX * this.projectileSpeed, 0);
    // Escala horizontal para dar visual de feixe
    p.setScale(3, 1);
  }
}
