import BaseWeapon from './BaseWeapon';

/**
 * PlasmaPenWeapon
 *
 * Arma final — implementada mas NÃO DESBLOQUEADA nesta etapa.
 * Para desbloquear: chamar useInventoryStore.getState().unlockWeapon('plasma-pen')
 *
 * Projétil de alta velocidade, longo alcance, dano elevado.
 * Aplica efeito 'burn' (queimadura — a ser implementado em etapa futura).
 */
export default class PlasmaPenWeapon extends BaseWeapon {
  constructor(scene, owner, pool) {
    super(scene, owner, 'plasma-pen', pool);
  }

  _doFire(originX, originY, dirX, _dirY) {
    const p = this.pool.acquire(originX, originY, {
      damage: this.damage,
      range: this.range,
      effectType: this.effectType, // 'burn' — reservado para implementação futura
      color: 0xff00ff, // magenta — plasma
    });
    if (!p) return;
    p.body.setVelocity(dirX * this.projectileSpeed, 0);
    p.setScale(2, 2); // visual maior
  }
}
