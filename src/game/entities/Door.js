import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * Door
 *
 * Porta da fase — bloqueada inicialmente.
 * Desbloqueada após o player coletar a chave.
 *
 * Estados:
 *  - 'locked'   → tint vermelho, bloqueia passagem
 *  - 'unlocked' → tint verde, permite entrada
 *
 * Ao tentar entrar sem a chave: texto flutuante "Precisa da chave!".
 * Ao entrar com a chave desbloqueada: emite 'door:enter'.
 */
export default class Door extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    // Placeholder visual — substituir por asset de porta dedicado
    super(scene, x, y, 'prop-cabinet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.PROPS_FRONT);
    this.setScale(1.5);
    this.setTint(0xff4444); // vermelho = bloqueada
    this.refreshBody();

    this.doorState = 'locked';
  }

  /** Desbloqueia a porta após o player coletar a chave. */
  unlock() {
    this.doorState = 'unlocked';
    this.setTint(0x44ff88); // verde = desbloqueada
  }

  /**
   * Tentativa de entrar na porta via interação (tecla X).
   * Chamado pelo handler de 'player:interact' na Scene.
   */
  tryEnter() {
    if (this.doorState === 'unlocked') {
      this.scene.events.emit('door:enter');
      return;
    }

    // Porta bloqueada — avisa o player
    if (this._warningText) return; // evita spam

    this._warningText = this.scene.add.text(this.x, this.y - 30, 'Precisa da chave!', {
      fontSize: '6px',
      color: '#ffaaaa',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(DEPTH.HUD);

    this.scene.tweens.add({
      targets: this._warningText,
      y: this._warningText.y - 16,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        if (this._warningText) {
          this._warningText.destroy();
          this._warningText = null;
        }
      },
    });
  }
}
