import Phaser from 'phaser';

/**
 * InputController
 *
 * Abstrai a leitura de teclado do Phaser para que Player (e futuras
 * entidades) não dependam diretamente da API de input do Phaser.
 * Suporta setas do teclado e WASD simultaneamente.
 *
 * Para pulo fluido, expõe tanto o "just down" (apertou) quanto o
 * "held" (segurando) — necessários para Coyote Time, Jump Buffer e
 * pulo variável (segurar = pula mais alto).
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