import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { clinica01Level } from '../data/levels/clinica01';
import { createAllAnimations } from '../systems/AnimationFactory';
import { setupCameraRig } from '../systems/CameraRig';
import Player from '../entities/Player';
import Coin from '../entities/Coin';
import Chest from '../entities/Chest';
import Key from '../entities/Key';
import Door from '../entities/Door';
import Checkpoint from '../entities/Checkpoint';
import { createEnemy } from '../systems/EnemyFactory';
import ProjectilePool from '../systems/ProjectilePool';
import { createWeapon } from '../systems/WeaponFactory';
import CombatSystem from '../systems/CombatSystem';
import InteractionSystem from '../systems/InteractionSystem';
import { gameEventBus } from '../events/GameEventBus';
import { TILE_SIZE, DEPTH } from '../../constants/gameSettings';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';
import { useProgressStore } from '../../store/useProgressStore';

export default class Clinica01Scene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.CLINICA_01);
  }

  create() {
    const level = clinica01Level;
    
    createAllAnimations(this);
    
    this.physics.world.setBounds(0, 0, level.world.width, level.world.height);
    
    // Grupos
    this.solidGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group();
    this.enemies = [];
    
    // Construção do nível
    this.buildGround(level.ground);
    this.buildPlatforms(level.platforms);
    this.buildProps(level.props);
    
    // Player (deve ser criado antes das moedas/inimigos pois eles referenciam scene.player)
    this.player = new Player(this, level.spawnPoint.x, level.spawnPoint.y);
    this.physics.add.collider(this.player, this.solidGroup);
    
    // Câmera
    setupCameraRig(this, this.player, level.world.width, level.world.height);
    
    // Sistemas
    this.projectilePool = new ProjectilePool(this, 30);
    this.enemyProjectilePool = new ProjectilePool(this, 30);
    this.interactionSystem = new InteractionSystem(this, this.player);
    
    // Entidades do nível
    this.buildCoins(level.coins);
    this.buildChests(level.chests);
    this.buildKey(level.keyItem);
    this.buildDoor(level.door);
    this.buildCheckpoints(level.checkpoints);
    this.buildEnemies(level.enemies);
    
    // Combat system (precisa dos grupos prontos)
    this.combatSystem = new CombatSystem(this, this.player, this.enemyGroup, this.projectilePool, this.enemyProjectilePool);

    // Dar uma arma inicial ao jogador
    this.playerWeapon = createWeapon(this, this.player, 'microagulhamento', this.projectilePool, this.enemyGroup);
    this.player.setWeapon(this.playerWeapon);
    
    // Trigger de fim (mantido do original)
    this.buildEndTrigger(level.endTrigger, level.key);
    
    // Registrar interações
    this._registerInteractions();
    
    // Conectar eventos ao Zustand
    this._bindEvents();
    
    // Notificar React que o nível está pronto
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

  buildCoins(coins) {
    coins.forEach(({ x, y }) => new Coin(this, x, y));
  }

  buildChests(chests) {
    this.chestList = chests.map(({ x, y }) => new Chest(this, x, y));
  }

  buildKey(keyData) {
    if (!keyData) return;
    this.keyEntity = new Key(this, keyData.x, keyData.y);
  }

  buildDoor(doorData) {
    if (!doorData) return;
    this.doorEntity = new Door(this, doorData.x, doorData.y);
  }

  buildCheckpoints(checkpoints) {
    this.checkpointList = checkpoints.map(({ x, y }) => new Checkpoint(this, x, y));
  }

  buildEnemies(enemiesData) {
    enemiesData.forEach(({ type, x, y }) => {
      const enemy = createEnemy(this, type, x, y);
      if (!enemy) return;
      enemy.setPlayer(this.player);
      this.physics.add.collider(enemy, this.solidGroup);
      this.enemyGroup.add(enemy);
      this.enemies.push(enemy);
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

  _registerInteractions() {
    // Registra baús
    this.chestList.forEach((chest, i) => {
      this.interactionSystem.register(`chest-${i}`, chest.x, chest.y, { width: 32, height: 40 }, 'chest');
    });
    
    // Registra porta
    if (this.doorEntity) {
      this.interactionSystem.register('door', this.doorEntity.x, this.doorEntity.y, { width: 24, height: 48 }, 'door');
    }
    
    // Registra checkpoints
    this.checkpointList.forEach((cp, i) => {
      this.interactionSystem.register(`checkpoint-${i}`, cp.x, cp.y, { width: 32, height: 40 }, 'checkpoint');
    });
  }

  _bindEvents() {
    const playerStore = usePlayerStore.getState;
    const gameStore = useGameStore.getState;
    const progressStore = useProgressStore.getState;
    
    // Dano ao player
    this.events.on('player:damaged', ({ amount }) => {
      playerStore().takeDamage(amount);
      if (playerStore().hp <= 0) this._respawnPlayer();
    });
    
    // Moeda coletada
    this.events.on('player:collect-coin', () => playerStore().addCoins(1));
    
    // Chave coletada
    this.events.on('player:collect-key', () => {
      playerStore().addKey();
      progressStore().collectKey();
      if (this.doorEntity) this.doorEntity.unlock();
    });
    
    // Baú aberto
    this.events.on('chest:opened', ({ x, y }) => {
      // Placeholder: sem loot ainda. Loot implementado na próxima etapa.
      console.info('[Clinica01Scene] Baú aberto em', x, y);
    });
    
    // Porta: entrar
    this.events.on('door:enter', () => {
      progressStore().openDoor();
      gameEventBus.emit('level:end-reached', { levelKey: clinica01Level.key });
    });
    
    // Checkpoint ativado
    this.events.on('checkpoint:activated', ({ x, y }) => {
      gameStore().setCheckpoint(x, y);
      progressStore().activateCheckpoint({ x, y });
    });
    
    // Inimigo morreu
    this.events.on('enemy:died', ({ xpReward }) => playerStore().addXp(xpReward));
    
    // Interagível próximo → atualiza HUD
    this.events.on('interaction:near-change', (data) => gameStore().setNearby(data));
    
    // Interação com X
    this.events.on('player:interact', ({ type, id }) => {
      if (type === 'chest') {
        const idx = parseInt(id.split('-')[1]);
        if (this.chestList[idx]) this.chestList[idx].open();
      } else if (type === 'door') {
        if (this.doorEntity) this.doorEntity.tryEnter();
      } else if (type === 'checkpoint') {
        const idx = parseInt(id.split('-')[1]);
        if (this.checkpointList[idx]) this.checkpointList[idx].activate(this.player.x, this.player.y);
      }
    });
  }

  _respawnPlayer() {
    const { lastCheckpoint } = useProgressStore.getState();
    usePlayerStore.getState().respawn(lastCheckpoint);
    this.player.setPosition(lastCheckpoint.x, lastCheckpoint.y);
    this.player.setVelocity(0, 0);
    // Invencibilidade pós-respawn: 2s
    this.player.invincibleUntil = this.time.now + 2000;
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    this.enemies.forEach((e) => { if (e.active) e.update(time, delta); });
  }
}
