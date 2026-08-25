import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { clinica01Level } from '../data/levels/clinica01';
import { createPlayerAnimations } from '../systems/AnimationFactory';
import { setupCameraRig } from '../systems/CameraRig';
import Player from '../entities/Player';
import { gameEventBus } from '../events/GameEventBus';
import { TILE_SIZE, DEPTH } from '../../constants/gameSettings';

/**
 * Clinica01Scene
 *
 * Primeira fase jogável (protótipo). Monta o corredor a partir dos dados
 * declarativos em `game/data/levels/clinica01.js`: piso, plataformas,
 * props de decoração/obstáculo, jogador e câmera.
 *
 * Propositalmente NÃO implementa: inimigos, moedas, chave, especialista,
 * quiz ou loja — isso fica para as próximas etapas.
 */
export default class Clinica01Scene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.CLINICA_01);
  }

  create() {
    const level = clinica01Level;

    createPlayerAnimations(this);

    this.physics.world.setBounds(0, 0, level.world.width, level.world.height);

    this.solidGroup = this.physics.add.staticGroup();

    this.buildGround(level.ground);
    this.buildPlatforms(level.platforms);
    this.buildProps(level.props);

    this.player = new Player(this, level.spawnPoint.x, level.spawnPoint.y);
    this.physics.add.collider(this.player, this.solidGroup);

    setupCameraRig(this, this.player, level.world.width, level.world.height);

    this.buildEndTrigger(level.endTrigger, level.key);

    gameEventBus.emit('level:ready', { levelKey: level.key });
  }

  /** Piso contínuo, tileado horizontalmente a partir de um único frame. */
  buildGround({ tileFrame, y, tileSize, startX, endX }) {
    const tileCount = Math.ceil((endX - startX) / tileSize);
    for (let i = 0; i < tileCount; i += 1) {
      const x = startX + i * tileSize;
      const tile = this.solidGroup.create(x, y, 'tiles-room-builder', tileFrame);
      tile.setOrigin(0, 0);
      tile.setDepth(DEPTH.PLATFORMS);
      tile.refreshBody();
    }
  }

  /** Plataformas flutuantes curtas, cada uma com N tiles de largura. */
  buildPlatforms(platforms) {
    platforms.forEach(({ tileFrame, y, startX, widthInTiles }) => {
      for (let i = 0; i < widthInTiles; i += 1) {
        const x = startX + i * TILE_SIZE;
        const tile = this.solidGroup.create(x, y, 'tiles-room-builder', tileFrame);
        tile.setOrigin(0, 0);
        tile.setDepth(DEPTH.PLATFORMS);
        tile.refreshBody();
      }
    });
  }

  /** Props de decoração e obstáculos (alguns sólidos, outros apenas visuais). */
  buildProps(props) {
    props.forEach(({ key, x, y, solid }) => {
      if (solid) {
        const prop = this.solidGroup.create(x, y, key);
        prop.setOrigin(0.5, 1);
        prop.setDepth(DEPTH.PROPS_FRONT);
        prop.refreshBody();
      } else {
        const prop = this.add.image(x, y, key);
        prop.setOrigin(0.5, 1);
        prop.setDepth(DEPTH.PROPS_BACK);
      }
    });
  }

  /** Zona de fim de corredor — apenas emite um evento nesta etapa. */
  buildEndTrigger({ x, y, width, height }, levelKey) {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);

    this.physics.add.overlap(this.player, zone, () => {
      if (this.endReached) return;
      this.endReached = true;
      gameEventBus.emit('level:end-reached', { levelKey });
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}
