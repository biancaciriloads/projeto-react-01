import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * Checkpoint
 *
 * Ponto de respawn. Ativado via interação (tecla X).
 *
 * Estados:
 *  - Inativo → tint cinza
 *  - Ativo   → tint verde
 *
 * Ao ativar: emite 'checkpoint:activated' com a posição do player,
 * para a Scene atualizar o useProgressStore/useGameStore.
 */
export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    // Placeholder visual — substituir por asset de bandeira/poste dedicado
    super(scene, x, y, 'prop-plant-aloe', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.PROPS_FRONT);
    this.setTint(0xaaaaaa); // cinza = inativo
    this.refreshBody();

    this.activated = false;
  }

  /**
   * Ativa o checkpoint.
   * @param {number} playerX - posição X do player no momento da ativação
   * @param {number} playerY - posição Y do player
   */
  activate(playerX, playerY) {
    if (this.activated) return;
    this.activated = true;

    this.setTint(0x00ff88); // verde = ativo

    this.scene.events.emit('checkpoint:activated', { x: playerX, y: playerY });

    // Texto flutuante
    const txt = this.scene.add.text(this.x, this.y - 24, 'Checkpoint!', {
      fontSize: '6px',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(DEPTH.HUD);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 16,
      alpha: 0,
      duration: 1800,
      onComplete: () => txt.destroy(),
    });
  }
}
