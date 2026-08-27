import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * Coin
 *
 * Moeda coletável. Ao tocar, incrementa o contador de moedas via
 * scene.events.emit('player:collect-coin').
 */
export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.COIN);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.setSize(10, 10);
    this.setOffset(3, 3);

    // Animação de flutuação
    this.tween = scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this._setupAnim(scene);
    this.play('coin-idle-anim');

    scene.physics.add.overlap(this, scene.player, this._onCollect, null, this);
  }

  _setupAnim(scene) {
    if (!scene.anims.exists('coin-idle-anim')) {
      scene.anims.create({
        key: 'coin-idle-anim',
        frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  _onCollect(player, coin) {
    coin.scene.events.emit('player:collect-coin');
    // Efeito visual:得快
    coin.scene.tweens.add({
      targets: coin,
      alpha: 0,
      scale: 1.4,
      duration: 200,
      onComplete: () => coin.destroy(),
    });
  }

  destroy(fromScene) {
    if (this.tween) this.tween.stop();
    super.destroy(fromScene);
  }
}
