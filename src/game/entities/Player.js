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
 * Mantém apenas o movimento e estado de locomoção do protagonista, sem a
 * lógica antiga de dano, knockback, armas ou projéteis.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-idle', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.PLAYER);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(PHYSICS.PLAYER_SPEED, PHYSICS.MAX_FALL_SPEED);

    this.body.setSize(14, 28);
    this.body.setOffset(9, 4);

    this.controls = new InputController(scene);
    this.state = STATES.IDLE;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.isJumping = false;
    this.wasOnGround = false;
    this.play('player-idle-anim');
  }

  respawn(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setAcceleration(0, 0);
    this.body.enable = true;
    this.alpha = 1;
    this.state = STATES.IDLE;
    this.playStateAnimation(STATES.IDLE);
  }

  update(time, delta) {
    if (!this.body) return;

    const onGround = this.body.blocked.down || this.body.touching.down;

    if (onGround) {
      this.coyoteTimer = PHYSICS.COYOTE_TIME;
    } else if (this.coyoteTimer > 0) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    if (this.controls.isJumpJustDown()) {
      this.jumpBufferTimer = PHYSICS.JUMP_BUFFER;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);
    }

    this.handleHorizontalMovement();
    this.handleJump();

    if (!this.controls.isJumpHeld() && this.body.velocity.y < 0 && this.isJumping) {
      this.setVelocityY(this.body.velocity.y * 0.4);
      this.isJumping = false;
    }

    this.wasOnGround = onGround;
    this.updateState(onGround);
  }

  handleHorizontalMovement() {
    const onGround = this.body.blocked.down || this.body.touching.down;
    const accel = onGround ? PHYSICS.ACCELERATION : PHYSICS.AIR_ACCELERATION;

    if (this.controls.isLeftDown()) {
      this.setDragX(0);
      this.setAccelerationX(-accel);
      this.setFlipX(true);
    } else if (this.controls.isRightDown()) {
      this.setDragX(0);
      this.setAccelerationX(accel);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
      this.setDragX(onGround ? PHYSICS.DRAG : PHYSICS.AIR_DRAG);
    }
  }

  handleJump() {
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.setVelocityY(-PHYSICS.PLAYER_JUMP_VELOCITY);
      this.isJumping = true;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }
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

  isInteractJustDown() {
    return this.controls.isInteractJustDown();
  }
}