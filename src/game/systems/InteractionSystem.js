import Phaser from 'phaser';
import { DEPTH } from '../../constants/gameSettings';

/**
 * InteractionSystem
 *
 * Sistema genérico de interação: detecta proximidade do Player a qualquer
 * objeto interativo (NPC, Baú, Porta, Checkpoint, Especialista) e
 * publica 'player:near' no events da Scene quando X é pressionado.
 *
 * Fluxo:
 *  1. Scene cria zonas de interação sobre os objetos (overlap sensor).
 *  2. Player entra na zona → InteractionSystem marca o objeto como "near".
 *  3. Player pressiona X → dispatch 'player:interact' com { type, data }.
 *  4. Player sai da zona → limpa "near".
 *
 * @example
 * const interaction = new InteractionSystem(scene, player);
 * interaction.register('chest', x, y, { width: 32, height: 32 }, chestData);
 */
export default class InteractionSystem {
  /**
   * @param {Phaser.Scene} scene
   * @param {Player} player
   */
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    /** Mapa de label → { zone, data, label, type } */
    this.interactables = new Map();
    /** Instância currently próxima, ou null */
    this.current = null;
    /** Grupo de sensores de overlap */
    this.zoneGroup = scene.physics.add.staticGroup();

    scene.events.on('update', this._update, this);
  }

  /**
   * Registra uma zona de interação.
   * @param {string} id     - identificador único dentro da cena
   * @param {number} x
   * @param {number} y
   * @param {object} size    - { width, height }
   * @param {object} data    - dados arbitrários do objeto (ex.: id do baú)
   * @param {string} type    - 'npc' | 'chest' | 'door' | 'checkpoint' | 'specialist'
   * @param {string} label   - texto do prompt (ex.: "PRESSIONE X")
   */
  register(id, x, y, size, type, label = 'PRESSIONE X') {
    const zone = this.scene.add.zone(x, y, size.width, size.height);
    this.scene.physics.add.existing(zone, true); // true = static body
    zone.setOrigin(0.5, 1);
    
    this.interactables.set(id, { zone, data: null, type, label });
  }

  /** Vincula dados arbitrários a um interagível já registrado. */
  setData(id, data) {
    const entry = this.interactables.get(id);
    if (entry) entry.data = data;
  }

  _update() {
    if (!this.player || !this.player.active) return;

    let closest = null;
    let closestDist = Infinity;

    // Detecta qual zona o jogador está mais próximo (center-to-center)
    this.interactables.forEach((entry) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        entry.zone.x, entry.zone.y
      );
      if (dist < 40 && dist < closestDist) {
        closestDist = dist;
        closest = entry;
      }
    });

    if (closest !== this.current) {
      this.current = closest;
      this.scene.events.emit('interaction:near-change', closest ? { type: closest.type, label: closest.label } : null);
    }

    // Dispara interação quando X é pressionado
    if (this.current && this.player.isInteractJustDown && this.player.isInteractJustDown()) {
      this.scene.events.emit('player:interact', {
        type: this.current.type,
        id: this._findId(this.current),
        data: this.current.data,
      });
    }
  }

  _findId(entry) {
    for (const [id, e] of this.interactables) {
      if (e === entry) return id;
    }
    return null;
  }

  /** Retorna o interagível atualmente próximo, ou null. */
  getCurrent() {
    return this.current;
  }

  /** Remove todos os listeners e limpa as zonas. */
  destroy() {
    this.scene.events.off('update', this._update, this);
    this.zoneGroup.destroy(true);
    this.interactables.clear();
    this.current = null;
  }
}
