import Phaser from 'phaser';
import BaseWeapon from './BaseWeapon';
import { DEPTH } from '../../../constants/gameSettings';

/**
 * ChicoteRadiofrequenciaWeapon
 *
 * Ataque melee em arco. Não usa projétil — cria uma zona de dano
 * temporária (200 ms) à frente do owner e aplica dano a inimigos
 * que estejam dentro dela.
 *
 * A zona é resolvida via overlap com o grupo de inimigos passado
 * na construção (referência ao enemyGroup da Scene).
 */
export default class ChicoteRadiofrequenciaWeapon extends BaseWeapon {
  /**
   * @param {Phaser.Scene} scene
   * @param {object} owner
   * @param {object} pool  - não utilizado nesta arma (melee)
   * @param {Phaser.GameObjects.Group} enemyGroup - grupo de inimigos da Scene
   */
  constructor(scene, owner, pool, enemyGroup) {
    super(scene, owner, 'chicote-radiofrequencia', pool);
    this.enemyGroup = enemyGroup;
  }

  _doFire(originX, originY, dirX, _dirY) {
    const offsetX = dirX * (this.range / 2);
    const zoneX = originX + offsetX;

    // Retângulo visual do arco
    const visual = this.scene.add.rectangle(
      zoneX, originY, this.range, 20, 0xff6600, 0.6,
    ).setDepth(DEPTH.PROJECTILE);

    // Verifica overlap manual com inimigos
    this.enemyGroup.getChildren().forEach((enemy) => {
      if (!enemy.active || enemy.isDead) return;
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        new Phaser.Geom.Rectangle(zoneX - this.range / 2, originY - 10, this.range, 20),
        enemy.getBounds(),
      )) {
        enemy.takeDamage(this.damage);
      }
    });

    // Remove visual após 200 ms
    this.scene.time.delayedCall(200, () => visual.destroy());
  }
}
