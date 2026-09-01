import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { TILE_SIZE, DEPTH } from '../../constants/gameSettings';
import { GRID_WIDTH, GRID_HEIGHT, gerarGrid, POSICAO_INICIAL, NPCS, ROOMS } from '../data/mapData';
import { createAllTopDownAnimations } from '../systems/AnimationFactory';
import { setupCameraRigTopDown } from '../systems/CameraRig';
import PlayerTopDown from '../entities/PlayerTopDown';
import InteractionSystem from '../systems/InteractionSystem';
import { gameEventBus } from '../events/GameEventBus';
import { useGameStore } from '../../store/useGameStore';

/**
 * ClinicaTDScene
 *
 * Cena principal no estilo Gather.town (top-down, sem gravidade).
 * Renderiza o mapa da clinica a partir de mapData.js e posiciona
 * NPCs (especialistas) em cada consultorio.
 *
 * Paleta de tiles (placeholders — sem Tiled por enquanto):
 *  '.'  => tile de piso caminhavel (cor: #d4c8b0)
 *  '#'  => parede nao-caminhavel (cor: #4a3f35)
 *  'L'  => piso da loja (cor: #b0c8d4)
 */
export default class ClinicaTDScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.CLINICA_TD);
  }

  create() {
    // Fisica sem gravidade (top-down)
    this.physics.world.gravity.y = 0;

    const grid = gerarGrid();
    const worldW = GRID_WIDTH * TILE_SIZE;
    const worldH = GRID_HEIGHT * TILE_SIZE;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    createAllTopDownAnimations(this);

    // Grupos fisicos
    this.wallGroup  = this.physics.add.staticGroup();
    this.floorGroup = this.add.group(); // decorativo

    this._buildTileGrid(grid);
    this._buildRoomLabels();

    // Spawn do jogador
    const spawnPx = this._gridToPx(POSICAO_INICIAL.x, POSICAO_INICIAL.y);
    this.player = new PlayerTopDown(this, spawnPx.cx, spawnPx.cy);
    this.physics.add.collider(this.player, this.wallGroup);

    // Camera
    setupCameraRigTopDown(this, this.player, worldW, worldH);

    // NPCs e zonas de interacao
    this.interactionSystem = new InteractionSystem(this, this.player);
    this._buildNPCs();

    // Liga eventos com o React
    this._bindEvents();
    gameEventBus.emit('level:ready', { levelKey: 'clinica-td' });
    useGameStore.getState().setLevel('clinica-td', { x: spawnPx.cx, y: spawnPx.cy });

    this.events.once('shutdown', this._cleanup, this);
    this.events.once('destroy',  this._cleanup, this);
  }

  // ---- Construcao do grid ----------------------------------------

  _buildTileGrid(grid) {
    const TS = TILE_SIZE;

    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        const cell = grid[row][col];
        const px   = col * TS;
        const py   = row * TS;

        if (cell === '#') {
          // Parede: retangulo colorido + corpo fisico estatico
          const wall = this.add.rectangle(px + TS / 2, py + TS / 2, TS, TS, 0x3a302a);
          wall.setDepth(DEPTH.PLATFORMS);
          this.physics.add.existing(wall, true);
          this.wallGroup.add(wall);
        } else {
          // Piso caminhavel
          const color = cell === 'L' ? 0xb8d8e8 : 0xd8cfc0;
          this.add.rectangle(px + TS / 2, py + TS / 2, TS, TS, color).setDepth(DEPTH.BACKGROUND);

          // Borda sutil entre tiles
          const border = this.add.rectangle(px + TS / 2, py + TS / 2, TS, TS, 0x000000, 0.06);
          border.setDepth(DEPTH.BACKGROUND + 1);
        }
      }
    }
  }

  /** Adiciona nome de cada sala sobre o piso. */
  _buildRoomLabels() {
    Object.values(ROOMS).forEach(({ nome, rect }) => {
      const cx = (rect.x + rect.w / 2) * TILE_SIZE;
      const cy = (rect.y + rect.h / 2) * TILE_SIZE;

      this.add.text(cx, cy, nome, {
        fontSize: '5px',
        fontFamily: 'monospace',
        color: '#444438',
        align: 'center',
      }).setOrigin(0.5).setDepth(DEPTH.PROPS_BACK);
    });
  }

  /** Cria sprites de NPC e registra no InteractionSystem. */
  _buildNPCs() {
    NPCS.forEach((npc) => {
      const px = this._gridToPx(npc.pos.x, npc.pos.y);

      // Circulo colorido como sprite placeholder do NPC
      const circle = this.add.circle(px.cx, px.cy, 6, Phaser.Display.Color.HexStringToColor(npc.cor).color);
      circle.setDepth(DEPTH.PROPS_FRONT);

      // Nome do NPC
      this.add.text(px.cx, px.cy - 10, npc.nome, {
        fontSize: '4px',
        fontFamily: 'monospace',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 2, y: 1 },
      }).setOrigin(0.5).setDepth(DEPTH.PROPS_FRONT + 1);

      // Zona de interacao
      const label = npc.isEspelho ? 'ESPELHO [X]' : `FALAR COM ${npc.nome.toUpperCase()} [X]`;
      this.interactionSystem.register(
        npc.id,
        px.cx,
        px.cy,
        { width: 32, height: 32 },
        npc.tema,   // type
        label,      // label
      );
      this.interactionSystem.setData(npc.id, { npcId: npc.id, salaId: npc.salaId, tema: npc.tema, nome: npc.nome });
    });
  }

  // ---- Helpers -------------------------------------------------------

  /** Converte coordenada de grid para centro em pixels. */
  _gridToPx(gx, gy) {
    return {
      cx: gx * TILE_SIZE + TILE_SIZE / 2,
      cy: gy * TILE_SIZE + TILE_SIZE / 2,
    };
  }

  // ---- Eventos -------------------------------------------------------

  _bindEvents() {
    this._offNear = this.events.on('interaction:near-change', (data) => {
      useGameStore.getState().setNearby(data);
    });

    this._offInteract = this.events.on('player:interact', ({ type, id, data }) => {
      if (type === 'loja') {
        gameEventBus.emit('ui:open-shop', data);
      } else if (type === 'espelho') {
        gameEventBus.emit('ui:open-mirror', data);
      } else {
        // Consultorio ou qualquer NPC de quiz
        gameEventBus.emit('ui:open-quiz', { salaId: data?.salaId, npcId: id, ...data });
      }
    });
  }

  _cleanup() {
    if (this._cleanedUp) return;
    this._cleanedUp = true;
    this.interactionSystem?.destroy();
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    // InteractionSystem ja se registra em scene.events.on('update') internamente
  }
}
