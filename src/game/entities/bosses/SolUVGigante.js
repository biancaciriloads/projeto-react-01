import BaseBoss from './BaseBoss';
import { BOSS_STATS } from '../../../constants/enemySettings';

const STATS = BOSS_STATS['sol-uv-gigante'];

/**
 * SolUVGigante
 *
 * Primeiro chefe do jogo — NÃO aparece no nível nesta etapa.
 * Estrutura e IA de fase 1 implementadas. Fase 2 é placeholder.
 *
 * Para spawnar: instanciar via código quando a sala de chefe for criada.
 *
 * Comportamento Fase 1:
 *  - Patrulha horizontal
 *  - Dispara projéteis UV periódicos em direção ao player
 *
 * Fase 2 (placeholder):
 *  - Aumenta velocidade de patrulha e cadência de disparo
 */
export default class SolUVGigante extends BaseBoss {
  constructor(scene, x, y) {
    // PLACEHOLDER visual: usa player-idle escalonado até asset próprio estar disponível
    super(scene, x, y, 'player-idle', STATS);

    this.setTint(0xffaa00);
    this.setScale(2); // chefe maior

    this.patrolStartX = x;
    this.patrolDir = 1;
    this.lastShotAt = 0;

    this.currentSpeed = STATS.speed;
    this.currentShootCooldown = STATS.shootCooldown;
  }

  /** Ao entrar na fase 2: aumenta agressividade. */
  nextPhase() {
    super.nextPhase();
    if (this.currentPhase === 2) {
      // Fase 2 — placeholder: aumenta velocidade e cadência
      this.currentSpeed = STATS.speed * 1.5;
      this.currentShootCooldown = STATS.shootCooldown * 0.6;
      console.info('[SolUVGigante] FASE 2 — IA completa a ser implementada na próxima etapa.');
    }
  }

  update(time, delta) {
    if (this.isDead || !this.active) return;

    if (this.isFrozen) {
      this.setVelocityX(0);
      return;
    }

    this._patrol();
    this._tryShooting(time);
    super.update(time, delta); // atualiza barra de HP
  }

  _patrol() {
    const targetPos = this.patrolStartX + this.patrolDir * STATS.patrolRange;

    if (this.patrolDir > 0 && this.x >= targetPos) this.patrolDir = -1;
    if (this.patrolDir < 0 && this.x <= this.patrolStartX - STATS.patrolRange) this.patrolDir = 1;

    this.setVelocityX(this.patrolDir * this.currentSpeed);
    this.setFlipX(this.patrolDir < 0);
  }

  _tryShooting(time) {
    if (!this.player || !this.player.active) return;
    if (time - this.lastShotAt < this.currentShootCooldown) return;

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
