import Phaser from 'phaser';
import { DEPTH } from '../../../constants/gameSettings';

/**
 * BaseEnemy
 *
 * Classe base para todos os inimigos. Estende Phaser.Physics.Arcade.Sprite.
 *
 * Responsabilidades:
 *  - Máquina de estados: 'idle' | 'walk' | 'hit' | 'death'
 *  - Receber dano com invencibilidade temporária (300 ms)
 *  - Aplicar efeitos: 'frozen' (para o inimigo por N ms)
 *  - Morte: anima fade-out, emite 'enemy:died', destrói o sprite
 *
 * Subclasses implementam `update(time, delta)` com a IA específica.
 */
export default class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} textureKey - spritesheet a usar
   * @param {object} stats - { hp, speed, damage, xpReward }
   */
  constructor(scene, x, y, textureKey, stats) {
    super(scene, x, y, textureKey, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.ENEMY);

    this.maxHp = stats.hp;
    this.hp = stats.hp;
    this.speed = stats.speed;
    this.damage = stats.damage;
    this.xpReward = stats.xpReward;

    this.state = 'idle';
    this.invincibleUntil = 0;
    this.frozenUntil = 0;
    this.isDead = false;

    /** Referência ao Player — injetada pela Scene via setPlayer(). */
    this.player = null;
  }

  /** Injeta a referência ao player (chamado pela Scene após criação). */
  setPlayer(player) {
    this.player = player;
  }

  /** True enquanto o efeito frozen estiver ativo. */
  get isFrozen() {
    return this.scene.time.now < this.frozenUntil;
  }

  /**
   * Aplica dano ao inimigo com janela de invencibilidade.
   * @param {number} amount
   */
  takeDamage(amount) {
    if (this.isDead) return;
    if (this.scene.time.now < this.invincibleUntil) return;

    this.invincibleUntil = this.scene.time.now + 300;
    this.hp = Math.max(0, this.hp - amount);

    this.scene.events.emit('enemy:damaged', { enemy: this, amount });
    this._flashHit();

    if (this.hp <= 0) this.die();
  }

  /**
   * Aplica um efeito de status.
   * @param {'frozen'} effectType
   * @param {number} duration - ms
   */
  applyEffect(effectType, duration) {
    if (effectType === 'frozen') {
      this.frozenUntil = this.scene.time.now + duration;
      this.setTint(0x88ccff);
      this.scene.time.delayedCall(duration, () => {
        if (!this.isDead && this.active) this.clearTint();
      });
    }
  }

  /** Flash vermelho ao receber dano. */
  _flashHit() {
    this.setTint(0xff4444);
    this.scene.time.delayedCall(200, () => {
      if (!this.isDead && this.active) this.clearTint();
    });
  }

  /** Mata o inimigo: desativa física, emite evento, fade-out e destroy. */
  die() {
    if (this.isDead) return;
    this.isDead = true;

    this.scene.events.emit('enemy:died', {
      xpReward: this.xpReward,
      x: this.x,
      y: this.y,
    });

    if (this.body) this.body.enable = false;
    this.setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 400,
      onComplete: () => this.destroy(),
    });
  }

  /**
   * Lógica de IA — implementada pelas subclasses.
   * @param {number} time
   * @param {number} delta
   */
  update(_time, _delta) {}
}
