import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { clinica01Level } from '../data/levels/clinica01';
import { createAllAnimations } from '../systems/AnimationFactory';
import { setupCameraRig } from '../systems/CameraRig';
import Player from '../entities/Player';
import InteractionSystem from '../systems/InteractionSystem';
import { gameEventBus } from '../events/GameEventBus';
import { TILE_SIZE, DEPTH } from '../../constants/gameSettings';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';

export default class Clinica01Scene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.CLINICA_01);
  }

  create() {
    const level = clinica01Level;

    // Redefine gravidade localmente para cena side-scroller
    this.physics.world.gravity.y = 900;

    createAllAnimations(this);
    this.physics.world.setBounds(0, 0, level.world.width, level.world.height);
    this.solidGroup = this.physics.add.staticGroup();

    this.buildGround(level.ground);
    this.buildPlatforms(level.platforms);
    this.buildProps(level.props);

    this.player = new Player(this, level.spawnPoint.x, level.spawnPoint.y);
    this.physics.add.collider(this.player, this.solidGroup);

    setupCameraRig(this, this.player, level.world.width, level.world.height);
    this.interactionSystem = new InteractionSystem(this, this.player);

    this.buildEndTrigger(level.endTrigger, level.key);
    this._offRespawn = gameEventBus.on('player:respawn', () => this._respawnPlayer());
    this.events.once('shutdown', this._cleanup, this);
    this.events.once('destroy', this._cleanup, this);

    gameEventBus.emit('level:ready', { levelKey: level.key });
    useGameStore.getState().setLevel(level.key, level.spawnPoint);
  }

  buildGround({ tileFrame, y, tileSize, startX, endX }) {
    const tileCount = Math.ceil((endX - startX) / tileSize);
    for (let i = 0; i < tileCount; i++) {
      const x = startX + i * tileSize;
      const tile = this.solidGroup.create(x, y, 'tiles-room-builder', tileFrame);
      tile.setOrigin(0, 0).setDepth(DEPTH.PLATFORMS).refreshBody();
    }
  }

  buildPlatforms(platforms) {
    platforms.forEach(({ tileFrame, y, startX, widthInTiles }) => {
      for (let i = 0; i < widthInTiles; i++) {
        const x = startX + i * TILE_SIZE;
        const tile = this.solidGroup.create(x, y, 'tiles-room-builder', tileFrame);
        tile.setOrigin(0, 0).setDepth(DEPTH.PLATFORMS).refreshBody();
      }
    });
  }

  buildProps(props) {
    props.forEach(({ key, x, y, solid }) => {
      if (solid) {
        const prop = this.solidGroup.create(x, y, key);
        prop.setOrigin(0.5, 1).setDepth(DEPTH.PROPS_FRONT).refreshBody();
      } else {
        this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(DEPTH.PROPS_BACK);
      }
    });
  }

  buildEndTrigger({ x, y, width, height }, levelKey) {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => {
      if (this.endReached) return;
      this.endReached = true;
      gameEventBus.emit('level:end-reached', { levelKey });
    });
  }

  _bindEvents() {
    const gameStore = useGameStore.getState;

    this._sceneEventHandlers = {
      nearChange: (data) => gameStore().setNearby(data),
      interact: ({ type, id }) => {
        if (type === 'goal' && id === 'goal') {
          gameEventBus.emit('level:end-reached', { levelKey: clinica01Level.key });
        }
      },
    };

    this.events.on('interaction:near-change', this._sceneEventHandlers.nearChange);
    this.events.on('player:interact', this._sceneEventHandlers.interact);
  }

  _cleanup() {
    if (this._cleanedUp) return;
    this._cleanedUp = true;

    if (this._sceneEventHandlers) {
      this.events.off('interaction:near-change', this._sceneEventHandlers.nearChange);
      this.events.off('player:interact', this._sceneEventHandlers.interact);
    }

    this.interactionSystem?.destroy();
    this._offRespawn?.();
  }

  _respawnPlayer() {
    const respawnPoint = useGameStore.getState().currentCheckpoint || { x: 60, y: 184 };
    this.player.respawn(respawnPoint.x, respawnPoint.y);
    usePlayerStore.getState().respawn(respawnPoint);
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
  }
}
