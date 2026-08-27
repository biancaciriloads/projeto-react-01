import Phaser from 'phaser';
import BaseEnemy from '../enemies/BaseEnemy';

/**
 * BaseBoss
 *
 * Classe base para chefes. Estende BaseEnemy com suporte a:
 *  - Múltiplas fases (currentPhase / maxPhases)
 *  - Barra de HP visual acima do sprite (Phaser Graphics)
 *  - Transição de fase ao atingir 50% de HP
 */
export default class BaseBoss extends BaseEnemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} textureKey
   * @param {object} stats - { hp, speed, damage, xpReward, phases }
   */
  constructor(scene, x, y, textureKey, stats) {
    super(scene, x, y, textureKey, stats);

    this.maxPhases = stats.phases ?? 2;
    this.currentPhase = 1;
    this._phaseChanged = false;

    // Barra de HP visual acima do sprite
    this._hpBar = scene.add.graphics();
    this._hpBarWidth = 60;
    this._hpBarHeight = 6;
    this._drawHpBar();
  }

  /** Redesenha a barra de HP proporcional ao HP atual. */
  _drawHpBar() {
    const g = this._hpBar;
    g.clear();

    const bx = this.x - this._hpBarWidth / 2;
    const by = this.y - this.height / 2 - 10;

    // Fundo
    g.fillStyle(0x222222, 0.8);
    g.fillRect(bx, by, this._hpBarWidth, this._hpBarHeight);

    // Preenchimento
    const ratio = Math.max(0, this.hp / this.maxHp);
    const color = ratio > 0.5 ? 0xff4444 : 0xff8800;
    g.fillStyle(color, 1);
    g.fillRect(bx, by, this._hpBarWidth * ratio, this._hpBarHeight);

    // Borda
    g.lineStyle(1, 0x000000, 1);
    g.strokeRect(bx, by, this._hpBarWidth, this._hpBarHeight);

    g.setDepth(this.depth + 1);
  }

  /** Avança para a próxima fase. Sobrescrever nas subclasses para adicionar comportamento. */
  nextPhase() {
    this.currentPhase += 1;
    this.scene.events.emit('boss:phase-change', {
      boss: this,
      phase: this.currentPhase,
    });
    console.info(`[BaseBoss] ${this.constructor.name} entrou na fase ${this.currentPhase}.`);
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    if (this.isDead) return;

    // Muda de fase quando HP cai abaixo de 50% (apenas uma vez por fase)
    if (!this._phaseChanged && this.currentPhase < this.maxPhases && this.hp < this.maxHp * 0.5) {
      this._phaseChanged = true;
      this.nextPhase();
    }
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.isDead && this.active) {
      this._drawHpBar();
    }
  }

  destroy(fromScene) {
    if (this._hpBar) this._hpBar.destroy();
    super.destroy(fromScene);
  }
}
