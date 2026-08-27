import BaseWeapon from './BaseWeapon';

/**
 * SprayCriogenicoWeapon
 *
 * Dispara um projétil que aplica o efeito 'frozen' no inimigo por 2 s.
 * Dano leve, cadência média — foco em controle de multidão.
 */
export default class SprayCriogenicoWeapon extends BaseWeapon {
  constructor(scene, owner, pool) {
    super(scene, owner, 'spray-criogenico', pool);
  }

  _doFire(originX, originY, dirX, _dirY) {
    const p = this.pool.acquire(originX, originY, {
      damage: this.damage,
      range: this.range,
      effectType: this.effectType, // 'frozen'
      color: 0x88ddff, // azul gelo
    });
    if (!p) return;
    p.body.setVelocity(dirX * this.projectileSpeed, 0);
  }
}
