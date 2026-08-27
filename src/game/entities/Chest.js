import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * Chest
 *
 * Baú interativo. Abre quando o InteractionSystem dispara 'player:interact'
 * com type 'chest'. Ao abrir: exibe texto flutuante "Baú aberto!" e emite
 * 'chest:opened' para a Scene registrar o evento (loot futuro).
 */
export default class Chest extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    // Usa prop existente como placeholder visual até asset dedicado
    super(scene, x, y, 'prop-wooden-cabinet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // corpo estático

    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.PROPS_FRONT);
    this.refreshBody();

    this.opened = false;
  }

  /** Abre o baú. Sem efeito se já aberto. */
  open() {
    if (this.opened) return;
    this.opened = true;

    // Visual de "aberto" — tint escuro
    this.setTint(0x666666);

    // Emite evento para a Scene (loot futuro)
    this.scene.events.emit('chest:opened', { x: this.x, y: this.y });

    // Texto flutuante
    const txt = this.scene.add.text(this.x, this.y - 24, 'Baú aberto!', {
      fontSize: '6px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(DEPTH.HUD);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 20,
      alpha: 0,
      duration: 1500,
      onComplete: () => txt.destroy(),
    });
  }
}
