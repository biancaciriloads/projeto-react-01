import { gameEventBus } from '../events/GameEventBus';
import { gerarGrid } from '../data/mapData';

const GRID_SIZE = 16;
const MIN_SCALE = 0.1;
const MAX_SCALE = 4;
const MIN_DEPTH = 1;
const MAX_DEPTH = 3;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeConfig(config = {}) {
  const scaleX = Number.isFinite(Number(config.scaleX)) ? Number(config.scaleX) : 1;
  const scaleY = Number.isFinite(Number(config.scaleY)) ? Number(config.scaleY) : scaleX;
  return {
    rotation: ((Number(config.rotation) || 0) % 360 + 360) % 360,
    scaleX: clamp(scaleX, MIN_SCALE, MAX_SCALE),
    scaleY: clamp(scaleY, MIN_SCALE, MAX_SCALE),
    depth: clamp(Math.round(Number(config.depth) || 1), MIN_DEPTH, MAX_DEPTH),
    hasCollision: Boolean(config.hasCollision),
  };
}

function toExportItem(object) {
  return {
    key: object.key,
    frame: object.frame?.name ?? 0,
    x: Math.round(object.x),
    y: Math.round(object.y),
    scaleX: Number(object.scaleX.toFixed(2)),
    scaleY: Number(object.scaleY.toFixed(2)),
    rotation: object.angle,
    depth: object.adminDepth,
    hasCollision: object.hasCollision,
  };
}

function createAssetImage(scene, key, x, y) {
  const texture = scene.textures.get(key);
  const frame = texture?.has(0) ? 0 : undefined;
  return scene.add.image(x, y, key, frame);
}

export default class AdminDecoratorSystem {
  constructor(scene) {
    this.scene = scene;
    this.preview = null;
    this.selectedKey = null;
    this.selectedConfig = normalizeConfig();
    this.placedObjects = [];
    this.active = false;

    this.handleToggle = ({ active }) => this.setActive(active);
    this.handleSelect = ({ key }) => this.select(key);
    this.handleUpdate = (config) => this.updateConfig(config);
    this.handleExport = () => this.exportScenario();

    this.offToggle = gameEventBus.on('admin:toggle', this.handleToggle);
    this.offSelect = gameEventBus.on('admin:select', this.handleSelect);
    this.offUpdate = gameEventBus.on('admin:update', this.handleUpdate);
    this.offExport = gameEventBus.on('admin:export', this.handleExport);

    this.onPointerMove = (pointer) => {
      if (this.active && this.preview) this.updatePreview(pointer);
    };
    this.onPointerDown = (pointer) => {
      if (!this.active) return;
      if (pointer.rightButtonDown()) this.removeAt(pointer.worldX, pointer.worldY);
      else if (pointer.leftButtonDown() && this.preview) this.placePreview();
    };
    this.onKeyDown = (event) => {
      if (!this.active || !this.preview) return;
      if (event.key.toLowerCase() === 'r') this.updateConfig({ rotation: this.preview.angle + 90 });
      if (event.key === '+' || event.key === '=') this.changeScale(0.1);
      if (event.key === '-' || event.key === '_') this.changeScale(-0.1);
      if (event.key === 'PageUp') this.updateConfig({ depth: this.selectedConfig.depth + 1 });
      if (event.key === 'PageDown') this.updateConfig({ depth: this.selectedConfig.depth - 1 });
    };

    scene.input.on('pointermove', this.onPointerMove);
    scene.input.on('pointerdown', this.onPointerDown);
    scene.input.keyboard?.on('keydown', this.onKeyDown);
  }

  setActive(active) {
    this.active = Boolean(active);
    if (!this.active) this.clearPreview();
    this.scene.input.setDefaultCursor(this.active ? 'crosshair' : 'default');
  }

  select(key) {
    this.selectedKey = key;
    this.selectedConfig = normalizeConfig();
    this.clearPreview();
    if (!key || !this.active) return;

    const texture = this.scene.textures.get(key);
    if (!texture || texture.key === '__MISSING') return;
    this.preview = createAssetImage(this.scene, key, 0, 0)
      .setAlpha(0.55)
      .setOrigin(0.5)
      .setDepth(this.selectedConfig.depth);
    this.applyConfig(this.preview);
  }

  updateConfig(config) {
    this.selectedConfig = normalizeConfig({ ...this.selectedConfig, ...config });
    if (this.preview) this.applyConfig(this.preview);
    gameEventBus.emit('admin:config-change', this.selectedConfig);
  }

  changeScale(delta) {
    const next = clamp(this.selectedConfig.scaleX + delta, MIN_SCALE, MAX_SCALE);
    this.updateConfig({ scaleX: next, scaleY: next });
  }

  applyConfig(object) {
    object.setScale(this.selectedConfig.scaleX, this.selectedConfig.scaleY);
    object.setAngle(this.selectedConfig.rotation);
    object.setDepth(this.selectedConfig.depth);
    object.adminDepth = this.selectedConfig.depth;
    object.hasCollision = this.selectedConfig.hasCollision;
  }

  updatePreview(pointer) {
    const x = Math.floor(pointer.worldX / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    const y = Math.floor(pointer.worldY / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    this.preview.setPosition(x, y);
  }

  placePreview() {
    const placed = createAssetImage(this.scene, this.selectedKey, this.preview.x, this.preview.y)
      .setOrigin(0.5);
    this.applyConfig(placed);
    if (this.selectedConfig.hasCollision) {
      this.scene.physics.add.existing(placed, true);
      placed.body.setSize(placed.displayWidth, placed.displayHeight, true);
      this.scene.wallGroup.add(placed);
    }
    this.placedObjects.push(placed);
    this.emitState();
  }

  removeAt(x, y) {
    const index = this.placedObjects
      .map((object, objectIndex) => ({ object, objectIndex }))
      .reverse()
      .find(({ object }) => object.getBounds().contains(x, y))?.objectIndex;
    if (index === undefined) return;
    const [object] = this.placedObjects.splice(index, 1);
    object.destroy();
    this.emitState();
  }

  clearPreview() {
    this.preview?.destroy();
    this.preview = null;
  }

  emitState() {
    gameEventBus.emit('admin:placed-change', {
      furniture: this.placedObjects.map(toExportItem),
      config: this.selectedConfig,
    });
  }

  exportScenario() {
    const payload = {
      matrix: gerarGrid(),
      furniture: this.placedObjects.map(toExportItem),
    };
    console.log('CENARIO ADMIN:', JSON.stringify(payload, null, 2));
    gameEventBus.emit('admin:scenario-exported', payload);
  }

  destroy() {
    this.offToggle();
    this.offSelect();
    this.offUpdate();
    this.offExport();
    this.scene.input.off('pointermove', this.onPointerMove);
    this.scene.input.off('pointerdown', this.onPointerDown);
    this.scene.input.keyboard?.off('keydown', this.onKeyDown);
    this.clearPreview();
    this.placedObjects.forEach((object) => object.destroy());
    this.placedObjects = [];
  }
}
