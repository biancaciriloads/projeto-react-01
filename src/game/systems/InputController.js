import Phaser from 'phaser';

/**
 * InputController
 *
 * Abstrai a leitura de teclado do Phaser para que Player (e futuras
 * entidades) não dependam diretamente da API de input do Phaser.
 * Suporta setas do teclado e WASD simultaneamente.
 *
 * Suporta tanto side-scroller (jump/fall) quanto top-down (4 direções).
 */
export default class InputController {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: 'W',
      left: 'A',
      down: 'S',
      right: 'D',
      jump: 'SPACE',
    });

    this.interact = scene.input.keyboard.addKeys({
      interact: 'X',
    });
  }

  isLeftDown() {
    return this.cursors.left.isDown || this.wasd.left.isDown;
  }

  isRightDown() {
    return this.cursors.right.isDown || this.wasd.right.isDown;
  }

  /** Top-down: movimento para cima (W ou seta cima). */
  isUpDown() {
    return this.cursors.up.isDown || this.wasd.up.isDown;
  }

  /** Top-down: movimento para baixo (S ou seta baixo). */
  isDownDown() {
    return this.cursors.down.isDown || this.wasd.down.isDown;
  }

  isJumpJustDown() {
    return (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.jump)
    );
  }

  /** Pulo variável: true enquanto o jogador estiver segurando o pulo. */
  isJumpHeld() {
    return this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.jump.isDown;
  }

  /** Interagir com objetos próximos (NPC, baú, porta, checkpoint, especialista). */
  isInteractJustDown() {
    return Phaser.Input.Keyboard.JustDown(this.interact.interact);
  }

}