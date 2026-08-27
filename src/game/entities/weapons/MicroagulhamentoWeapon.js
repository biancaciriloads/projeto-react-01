import BaseWeapon from './BaseWeapon';

/**
 * MicroagulhamentoWeapon
 *
 * Dispara pequenas agulhas em linha reta na direção do jogador.
 * Projétil rápido, dano leve, cadência alta.
 */
export default class MicroagulhamentoWeapon extends BaseWeapon {
  constructor(scene, owner, pool) {
    super(scene, owner, 'microagulhamento', pool);
  }

  _doFire(originX, originY, dirX, _dirY) {
    const p = this.pool.acquire(originX, originY, {
      damage: this.damage,
      range: this.range,
      effectType: this.effectType,
      color: 0xffaacc, // rosa — agulha estética
    });
    if (!p) return;
    p.body.setVelocity(dirX * this.projectileSpeed, 0);
  }
}
