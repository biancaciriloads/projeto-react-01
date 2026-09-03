import Phaser from 'phaser';
import InputController from '../systems/InputController';
import { DEPTH } from '../../constants/gameSettings';

/** Velocidade de caminhada top-down (px/s). */
const TOP_DOWN_SPEED = 90;

const DIRS = { DOWN: 'down', UP: 'up', LEFT: 'left', RIGHT: 'right' };

/**
 * PlayerTopDown
 *
 * Jogador para cenas com perspectiva top-down (estilo Gather.town).
 * Sem gravidade, sem pulo — movimento em 4 direcoes via setVelocity.
 * Usa os mesmos spritesheets do Player com animacoes direcionais
 * criadas pelo TopDownAnimationFactory.
 */
export default class PlayerTopDown extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-custom', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.PLAYER);
    this.setCollideWorldBounds(true);
    this.setScale(0.5);
    this.setOrigin(0.5, 1);

    // Hitbox compacta nos pes do sprite 48x96
    this.body.setSize(12, 12);
    this.body.setOffset(18, 84);

    this.controls = new InputController(scene);
    this.facing = DIRS.DOWN;

    this.play('td-idle-down');
  }

  /** Repositiona sem animar (troca de sala ou respawn). */
  teleport(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.facing = DIRS.DOWN;
    this.play('td-idle-down', true);
  }

  update() {
    if (!this.body) return;

    const left  = this.controls.isLeftDown();
    const right = this.controls.isRightDown();
    const up    = this.controls.isUpDown();
    const down  = this.controls.isDownDown();

    let vx = 0;
    let vy = 0;

    if (left)  vx = -TOP_DOWN_SPEED;
    if (right) vx =  TOP_DOWN_SPEED;
    if (up)    vy = -TOP_DOWN_SPEED;
    if (down)  vy =  TOP_DOWN_SPEED;

    // Normaliza diagonal para nao andar mais rapido em diagonal
    if (vx !== 0 && vy !== 0) {
      vx /= Math.SQRT2;
      vy /= Math.SQRT2;
    }

    this.setVelocity(vx, vy);
    this._updateFacingAndAnim(vx, vy, left, right, up, down);
  }

  _updateFacingAndAnim(vx, vy, left, right, up, down) {
    const moving = vx !== 0 || vy !== 0;

    if (moving) {
      if (left)       this.facing = DIRS.LEFT;
      else if (right) this.facing = DIRS.RIGHT;
      else if (up)    this.facing = DIRS.UP;
      else if (down)  this.facing = DIRS.DOWN;
    }

    const prefix = moving ? 'td-walk' : 'td-idle';
    const animKey = prefix + '-' + this.facing;

    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey, true);
    }
  }

  /** Exposto para o InteractionSystem verificar tecla de interacao. */
  isInteractJustDown() {
    return this.controls.isInteractJustDown();
  }
}
