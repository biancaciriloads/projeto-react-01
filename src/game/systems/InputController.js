import Phaser from 'phaser';

/**
 * InputController
 *
 * Abstrai a leitura de teclado do Phaser para que o Player (e futuras
 * entidades) não dependam diretamente da API de input do Phaser.
 * Suporta setas do teclado e WASD simultaneamente.
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
}
