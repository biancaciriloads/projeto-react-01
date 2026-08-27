import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * Key
 *
 * Chave coletável que desbloqueia a porta da fase.
 * Flutua com tween e desaparece ao ser coletada (overlap com player).
 * Emite 'player:collect-key' via scene.events.
 */
export default class Key extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    // Placeholder visual com tint dourado — substituir por asset dedicado
    super(scene, x, y, 'prop-biohazard-bin', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.KEY);
    this.setScale(0.4);
    this.setTint(0xffd700); // dourado
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    // Animação de flutuação
    this._tween = scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.collected = false;
    scene.physics.add.overlap(this, scene.player, this._onCollect, null, this);
  }

  _onCollect() {
    if (this.collected) return;
    this.collected = true;

    this.scene.events.emit('player:collect-key');

    if (this._tween) this._tween.stop();

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      onComplete: () => this.destroy(),
    });
  }

  destroy(fromScene) {
    if (this._tween) this._tween.stop();
    super.destroy(fromScene);
  }
}
