import Phaser from 'phaser';

/**
 * CombatSystem
 *
 * Gerencia toda a lógica de combate da cena:
 *  - Projéteis do player acertam inimigos
 *  - Inimigos tocam o player (com knockback extra para Oleosidade)
 *  - Projéteis de inimigos (raios UV) acertam o player
 *  - Escuta 'enemy:shoot' para criar projéteis inimigos via pool separada
 *
 * Segue o princípio de Responsabilidade Única — a Scene não conhece
 * detalhes de colisão/dano; delega tudo ao CombatSystem.
 */
export default class CombatSystem {
  /**
   * @param {Phaser.Scene} scene
   * @param {import('../entities/Player').default} player
   * @param {Phaser.GameObjects.Group} enemyGroup
   * @param {import('./ProjectilePool').default} playerProjectilePool - projéteis do player
   * @param {import('./ProjectilePool').default} enemyProjectilePool  - projéteis dos inimigos
   */
  constructor(scene, player, enemyGroup, playerProjectilePool, enemyProjectilePool) {
    this.scene = scene;
    this.player = player;
    this.enemyGroup = enemyGroup;
    this.playerPool = playerProjectilePool;
    this.enemyPool = enemyProjectilePool;

    // Projéteis do player vs inimigos
    scene.physics.add.overlap(
      playerProjectilePool.group,
      enemyGroup,
      this._onPlayerProjectileHitEnemy,
      null,
      this,
    );

    // Projéteis de inimigos vs player
    scene.physics.add.overlap(
      enemyProjectilePool.group,
      player,
      this._onEnemyProjectileHitPlayer,
      null,
      this,
    );

    // Inimigos em contato com o player
    scene.physics.add.overlap(
      player,
      enemyGroup,
      this._onEnemyTouchPlayer,
      null,
      this,
    );

    // Escuta disparos de inimigos
    scene.events.on('enemy:shoot', this._onEnemyShoot, this);
  }

  _onPlayerProjectileHitEnemy(projectile, enemy) {
    if (!projectile.active || !enemy.active || enemy.isDead) return;
    enemy.takeDamage(projectile.damage);
    if (projectile.effectType) enemy.applyEffect(projectile.effectType, 2000);
    this.playerPool.release(projectile);
  }

  _onEnemyProjectileHitPlayer(player, projectile) {
    if (!projectile.active) return;
    player.takeDamage(projectile.damage, projectile.x);
    this.enemyPool.release(projectile);
  }

  _onEnemyTouchPlayer(player, enemy) {
    if (!enemy.active || enemy.isDead) return;

    // Knockback extra para Oleosidade
    const extraKnockback = enemy.knockbackExtra ?? 0;
    player.takeDamage(enemy.damage, enemy.x);

    if (extraKnockback > 0) {
      const dir = player.x < enemy.x ? -1 : 1;
      player.setVelocityX((player.body?.velocity.x ?? 0) + dir * extraKnockback);
    }
  }

  _onEnemyShoot({ enemy, targetX, targetY }) {
    const p = this.enemyPool.acquire(enemy.x, enemy.y, {
      damage: enemy.damage,
      range: 250,
      color: 0xffee00, // amarelo UV
      effectType: null,
    });
    if (!p) return;

    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, targetX, targetY);
    const speed = 150;
    p.body.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    );
  }

  /** Remove listeners ao destruir a cena. */
  destroy() {
    this.scene.events.off('enemy:shoot', this._onEnemyShoot, this);
  }
}
