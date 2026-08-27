import Phaser from 'phaser';
import BaseEnemy from './BaseEnemy';
import { ENEMY_STATS } from '../../../constants/enemySettings';

const STATS = ENEMY_STATS['bacteria'];

/**
 * BacteriaEnemy
 *
 * Inimigo que representa bactérias prejudiciais à pele.
 *
 * Comportamento:
 *  - Move-se rapidamente em direção ao player (agressivo)
 *  - Pouca vida — morre rápido mas ataca rápido também
 *  - Sempre persegue o player dentro do chaseRange
 */
export default class BacteriaEnemy extends BaseEnemy {
  constructor(scene, x, y) {
    // PLACEHOLDER: usa spritesheet do player como visual provisório
    // Substituir por spritesheet dedicado de Bactéria quando disponível
    super(scene, x, y, 'player-run', STATS);

    this.setTint(0x44ff44); // verde-bactéria
    this.setScale(0.7);     // menor que os outros inimigos

    this.play('bacteria-walk');
  }

  update(_time, _delta) {
    if (this.isDead || !this.active || !this.player) return;

    if (this.isFrozen) {
      this.setVelocityX(0);
      if (this.anims.currentAnim?.key !== 'bacteria-idle') this.play('bacteria-idle', true);
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

    if (dist < STATS.chaseRange) {
      const dirX = this.player.x > this.x ? 1 : -1;
      this.setVelocityX(dirX * this.speed);
      this.setFlipX(dirX < 0);
      if (this.anims.currentAnim?.key !== 'bacteria-walk') this.play('bacteria-walk', true);
    } else {
      this.setVelocityX(0);
      if (this.anims.currentAnim?.key !== 'bacteria-idle') this.play('bacteria-idle', true);
    }
  }
}
