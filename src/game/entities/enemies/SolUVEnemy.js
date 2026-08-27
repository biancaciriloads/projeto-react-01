import BaseEnemy from './BaseEnemy';
import { ENEMY_STATS } from '../../../constants/enemySettings';

const STATS = ENEMY_STATS['sol-uv'];

/**
 * SolUVEnemy
 *
 * Inimigo que representa os raios UV prejudiciais à pele.
 *
 * Comportamento:
 *  - Patrulha horizontal num raio de `patrolRange` pixels ao redor do ponto de spawn
 *  - A cada `shootCooldown` ms, se o player estiver dentro de `shootRange`,
 *    emite 'enemy:shoot' para o CombatSystem disparar um projétil UV
 */
export default class SolUVEnemy extends BaseEnemy {
  constructor(scene, x, y) {
    // PLACEHOLDER: usa spritesheet do player como visual provisório
    // Substituir por spritesheet dedicado de Sol UV quando disponível
    super(scene, x, y, 'player-idle', STATS);

    this.setTint(0xffdd00); // amarelo-sol para diferenciar do player

    this.patrolStartX = x;
    this.patrolDir = 1;
    this.lastShotAt = 0;

    this.play('sol-uv-idle');
  }

  update(time, delta) {
    if (this.isDead || !this.active) return;

    if (this.isFrozen) {
      this.setVelocityX(0);
      return;
    }

    this._patrol(time);
    this._tryShooting(time);
  }

  _patrol(time) {
    const targetX = this.patrolStartX + this.patrolDir * STATS.patrolRange;

    if (this.patrolDir > 0 && this.x >= targetX) this.patrolDir = -1;
    if (this.patrolDir < 0 && this.x <= this.patrolStartX - STATS.patrolRange) this.patrolDir = 1;

    this.setVelocityX(this.patrolDir * this.speed);
    this.setFlipX(this.patrolDir < 0);

    if (this.anims.currentAnim?.key !== 'sol-uv-walk') this.play('sol-uv-walk', true);
  }

  _tryShooting(time) {
    if (!this.player || !this.player.active) return;
    if (time - this.lastShotAt < STATS.shootCooldown) return;

    const dist = Math.abs(this.x - this.player.x);
    if (dist > STATS.shootRange) return;

    this.lastShotAt = time;
    this.scene.events.emit('enemy:shoot', {
      enemy: this,
      targetX: this.player.x,
      targetY: this.player.y,
    });
  }
}
