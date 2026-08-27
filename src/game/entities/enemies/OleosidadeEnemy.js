import Phaser from 'phaser';
import BaseEnemy from './BaseEnemy';
import { ENEMY_STATS } from '../../../constants/enemySettings';

const STATS = ENEMY_STATS['oleosidade'];

/**
 * OleosidadeEnemy
 *
 * Inimigo que representa a oleosidade da pele.
 *
 * Comportamento:
 *  - Anda lentamente em direção ao player quando dentro do chaseRange
 *  - Ao tocar no player, o CombatSystem aplica knockback extra (STATS.knockbackExtra)
 *  - Fica imóvel (idle) se o player estiver fora do range
 */
export default class OleosidadeEnemy extends BaseEnemy {
  constructor(scene, x, y) {
    // PLACEHOLDER: usa spritesheet do player como visual provisório
    // Substituir por spritesheet dedicado de Oleosidade quando disponível
    super(scene, x, y, 'player-idle', STATS);

    this.setTint(0xaa8800); // amarelo-esverdeado para representar oleosidade

    /** Exposto para o CombatSystem saber que deve aplicar knockback extra. */
    this.knockbackExtra = STATS.knockbackExtra;

    this.play('oleosidade-idle');
  }

  update(_time, _delta) {
    if (this.isDead || !this.active || !this.player) return;

    if (this.isFrozen) {
      this.setVelocityX(0);
      if (this.anims.currentAnim?.key !== 'oleosidade-idle') this.play('oleosidade-idle', true);
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

    if (dist < STATS.chaseRange) {
      const dirX = this.player.x > this.x ? 1 : -1;
      this.setVelocityX(dirX * this.speed);
      this.setFlipX(dirX < 0);
      if (this.anims.currentAnim?.key !== 'oleosidade-walk') this.play('oleosidade-walk', true);
    } else {
      this.setVelocityX(0);
      if (this.anims.currentAnim?.key !== 'oleosidade-idle') this.play('oleosidade-idle', true);
    }
  }
}
