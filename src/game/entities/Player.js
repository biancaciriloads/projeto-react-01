import Phaser from 'phaser';
import InputController from '../systems/InputController';
import { PHYSICS, DEPTH } from '../../constants/gameSettings';

const STATES = {
  IDLE: 'idle',
  RUN: 'run',
  JUMP: 'jump',
  FALL: 'fall',
};

/**
 * Player
 *
 * Encapsula o sprite físico do jogador e sua máquina de estados simples
 * (idle / run / jump / fall). Nesta etapa não há ataques, armas ou
 * inventário — apenas movimentação básica de plataforma.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-idle', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.PLAYER);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(PHYSICS.PLAYER_SPEED, PHYSICS.MAX_FALL_SPEED);

    // Corpo de colisão um pouco menor que o sprite, para gameplay mais justo.
    this.body.setSize(14, 28);
    this.body.setOffset(9, 4);

    this.input = new InputController(scene);
    this.state = STATES.IDLE;

    this.play('player-idle-anim');
  }

  update() {
    const onGround = this.body.blocked.down || this.body.touching.down;

    // --- Movimento horizontal ---
    if (this.input.isLeftDown()) {
      this.setVelocityX(-PHYSICS.PLAYER_SPEED);
      this.setFlipX(true);
    } else if (this.input.isRightDown()) {
      this.setVelocityX(PHYSICS.PLAYER_SPEED);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // --- Pulo ---
    if (this.input.isJumpJustDown() && onGround) {
      this.setVelocityY(-PHYSICS.PLAYER_JUMP_VELOCITY);
    }

    this.updateState(onGround);
  }

  updateState(onGround) {
    let nextState = this.state;

    if (!onGround) {
      nextState = this.body.velocity.y < 0 ? STATES.JUMP : STATES.FALL;
    } else if (Math.abs(this.body.velocity.x) > 1) {
      nextState = STATES.RUN;
    } else {
      nextState = STATES.IDLE;
    }

    if (nextState !== this.state) {
      this.state = nextState;
      this.playStateAnimation(nextState);
    }
  }

  playStateAnimation(state) {
    switch (state) {
      case STATES.RUN:
        this.play('player-run-anim', true);
        break;
      case STATES.JUMP:
      case STATES.FALL:
        this.play('player-airborne-anim', true);
        break;
      case STATES.IDLE:
      default:
        this.play('player-idle-anim', true);
        break;
    }
  }
}
