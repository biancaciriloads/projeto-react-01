import Phaser from 'phaser';

/**
 * ProjectilePool
 *
 * Pool de projéteis usando Phaser.GameObjects.Group com física Arcade.
 * Texturas geradas em runtime via Graphics — sem dependência de assets externos.
 *
 * Fluxo:
 *  1. Cena cria um pool: `new ProjectilePool(scene, 30)`
 *  2. Arma chama `pool.acquire(x, y, config)` → projétil ativado
 *  3. Update automático monitora distância percorrida → `pool.release(p)` ao atingir range
 *  4. CombatSystem chama `pool.release(p)` ao colidir com inimigo
 */
export default class ProjectilePool {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} maxSize - número máximo de projéteis simultâneos
   */
  constructor(scene, maxSize = 30) {
    this.scene = scene;
    this.maxSize = maxSize;

    this._ensureTextures();

    this.group = scene.physics.add.group({
      maxSize,
      runChildUpdate: false,
    });

    // Pré-popula o pool com objetos inativos
    for (let i = 0; i < maxSize; i++) {
      const p = scene.physics.add.sprite(0, 0, 'projectile-default');
      p.setActive(false).setVisible(false);
      if (p.body) p.body.enable = false;
      this.group.add(p, true);
    }

    scene.events.on('update', this._updateAll, this);
  }

  /** Cria texturas de projétil em runtime se ainda não existirem. */
  _ensureTextures() {
    const { textures, add } = this.scene;
    if (!textures.exists('projectile-default')) {
      const g = add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture('projectile-default', 4, 4);
      g.destroy();
    }
  }

  /**
   * Adquire e ativa um projétil do pool.
   *
   * @param {number} x
   * @param {number} y
   * @param {object} config - { damage, speed, range, color, effectType }
   * @returns {Phaser.Physics.Arcade.Sprite|null} null se pool esgotado
   */
  acquire(x, y, config) {
    const p = this.group.getFirstDead(false);
    if (!p) return null;

    p.setPosition(x, y);
    p.setActive(true).setVisible(true);
    p.setDepth(22); // DEPTH.PROJECTILE
    if (p.body) {
      p.body.enable = true;
      p.body.setAllowGravity(false);
    }

    p.damage = config.damage ?? 10;
    p.range = config.range ?? 200;
    p.effectType = config.effectType ?? null;
    p.startX = x;
    p.startY = y;

    if (config.color !== undefined) {
      p.setTint(config.color);
    } else {
      p.clearTint();
    }

    return p;
  }

  /**
   * Desativa um projétil e o devolve ao pool.
   * @param {Phaser.Physics.Arcade.Sprite} p
   */
  release(p) {
    if (!p || !p.active) return;
    p.setActive(false).setVisible(false);
    if (p.body) {
      p.body.enable = false;
      p.body.setVelocity(0, 0);
    }
  }

  /** Chamado automaticamente a cada frame: verifica alcance. */
  _updateAll() {
    this.group.getChildren().forEach((p) => {
      if (!p.active) return;
      const dist = Phaser.Math.Distance.Between(p.startX, p.startY, p.x, p.y);
      if (dist >= p.range) {
        this.release(p);
      }
    });
  }

  /** Libera recursos e listeners. */
  destroy() {
    this.scene.events.off('update', this._updateAll, this);
    this.group.destroy(true);
  }
}
