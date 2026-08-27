import Phaser from 'phaser';
import InputController from '../systems/InputController';
import { PHYSICS, DEPTH } from '../../constants/gameSettings';

const STATES = {
  IDLE: 'idle',
  RUN: 'run',
  JUMP: 'jump',
  FALL: 'fall',
  HURT: 'hurt',
};

/**
 * Player
 *
 * Encapsula o sprite físico do jogador e sua máquina de estados
 * (idle / run / jump / fall / hurt). Suporta:
 *  - Aceleração / desaceleração horizontal
 *  - Controle no ar (aceleração reduzida no ar)
 *  - Coyote Time (pular pouco depois de sair da plataforma)
 *  - Jump Buffer (comando de pulo é guardado por um instante)
 *  - Pulo variável (soltar o botão corta o pulo)
 *  - Dano com invencibilidade temporária + knockback
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

    this.controls = new InputController(scene);
    this.state = STATES.IDLE;

    // --- Estado interno de pulo ---
    this.coyoteTimer = 0;      // ms restantes para "coyote jump"
    this.jumpBufferTimer = 0;  // ms restantes para "jump buffer"
    this.isJumping = false;    // true durante a fase ascendente do pulo
    this.wasOnGround = false;  // monitorar se estávamos no chão no frame anterior

    // --- Estado de dano ---
    this.invincibleUntil = 0;  // timestamp até o qual o player é invencível
    this.knockbackTimer = 0;   // ms restantes de knockback

    this.weapon = null; // arma equipada
    this.play('player-idle-anim');
  }

  setWeapon(weapon) {
    this.weapon = weapon;
  }

  /**
   * Aplica dano ao jogador, disparando invencibilidade temporária,
   * animação de dano e knockback na direção oposta.
   */
  takeDamage(amount, fromX) {
    if (this.scene.time.now < this.invincibleUntil) return;
    this.invincibleUntil = this.scene.time.now + 1000; // 1s de invencibilidade
    this.knockbackTimer = 200; // 200ms de knockback

    // Empurra na direção oposta ao atacante
    const dir = this.x < fromX ? -1 : 1;
    this.setVelocity(dir * 200, -180);

    this.playStateAnimation(STATES.HURT);

    // Publica o dano no barramento de eventos para a HUD/PlayerStore reagir
    this.scene.events.emit('player:damaged', { amount });
  }

  update(time, delta) {
    const onGround = this.body.blocked.down || this.body.touching.down;

    // --- Coyote Time ---
    if (onGround) {
      this.coyoteTimer = PHYSICS.COYOTE_TIME;
    } else if (this.coyoteTimer > 0) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // --- Jump Buffer ---
    if (this.controls.isJumpJustDown()) {
      this.jumpBufferTimer = PHYSICS.JUMP_BUFFER;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);
    }

    // --- Knockback sobrepõe movimento durante um curto período ---
    if (this.knockbackTimer > 0) {
      this.knockbackTimer = Math.max(0, this.knockbackTimer - delta);
    } else {
      this.handleHorizontalMovement();
      this.handleJump();
      this.handleAttack(time);
    }

    // --- Pulo variável ---
    if (!this.controls.isJumpHeld() && this.body.velocity.y < 0 && this.isJumping) {
      // Soltou o botão durante a subida = corta o pulo
      this.setVelocityY(this.body.velocity.y * 0.4);
      this.isJumping = false;
    }

    // Efeito visual de invencibilidade (piscar)
    if (time < this.invincibleUntil) {
      this.alpha = Math.floor(time / 80) % 2 === 0 ? 0.4 : 1;
    } else {
      this.alpha = 1;
    }

    this.wasOnGround = onGround;
    this.updateState(time, onGround);
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
      // Sem direção = desacelera usando drag
      this.setAccelerationX(0);
      this.setDragX(onGround ? PHYSICS.DRAG : PHYSICS.AIR_DRAG);
    }
  }

  handleJump() {
    // Coyote Time + Jump Buffer: se ambos válidos, pula.
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.setVelocityY(-PHYSICS.PLAYER_JUMP_VELOCITY);
      this.isJumping = true;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }
  }

  handleAttack(time) {
    if (this.weapon && this.controls.isAttackJustDown()) {
      const dirX = this.flipX ? -1 : 1;
      this.weapon.fire(time, this.x, this.y, dirX, 0);
    }
  }

  updateState(time, onGround) {
    let nextState = this.state;

    if (time < this.invincibleUntil && this.knockbackTimer > 0) {
      nextState = STATES.HURT;
    } else if (!onGround) {
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
      case STATES.HURT:
        this.play('player-airborne-anim', true);
        break;
      case STATES.IDLE:
      default:
        this.play('player-idle-anim', true);
        break;
    }
  }

  // API exposta para a Scene (ex.: recebe Interact JustDown)
  isInteractJustDown() {
    return this.controls.isInteractJustDown();
  }
}