import Phaser from 'phaser';
import { SCENE_KEYS } from '../../constants/sceneKeys';
import { TILE_SIZE, DEPTH } from '../../constants/gameSettings';
import { POSICAO_INICIAL, ROOMS } from '../data/mapData';
import { createAllTopDownAnimations } from '../systems/AnimationFactory';
import { setupCameraRigTopDown } from '../systems/CameraRig';
import PlayerTopDown from '../entities/PlayerTopDown';
import InteractionSystem from '../systems/InteractionSystem';
import { gameEventBus } from '../events/GameEventBus';
import { useGameStore } from '../../store/useGameStore';
import { dialogueData } from '../../data/dialogueData';
import { quizData } from '../../data/quizData';
import AdminDecoratorSystem from '../systems/AdminDecoratorSystem';

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
 */
export default class ClinicaTDScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.CLINICA_TD);
  }

  preload() {
    this.load.image('mapa_clinica', '/assets/mapa/mapa_clinica.png');

    // Hardcoded NPC Sprite Loading (spritesheets 48x96 por frame)
    this.load.spritesheet('npc_bianca', '/assets/sprites/EspecialistaMestreBiancaCirilo.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc_enrico', '/assets/sprites/RecepcionistaEnrico.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc_nicolle', '/assets/sprites/Especialista1Nicolle.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc_henrique', '/assets/sprites/Especialista2Henrique.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc_felipe', '/assets/sprites/Especialista3Felipe.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc_ryan', '/assets/sprites/Especialista4Ryan.png', { frameWidth: 48, frameHeight: 96 });

    // Aliases adicionais com hífen para total compatibilidade
    this.load.spritesheet('npc-bianca', '/assets/sprites/EspecialistaMestreBiancaCirilo.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc-enrico', '/assets/sprites/RecepcionistaEnrico.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc-nicolle', '/assets/sprites/Especialista1Nicolle.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc-henrique', '/assets/sprites/Especialista2Henrique.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc-felipe', '/assets/sprites/Especialista3Felipe.png', { frameWidth: 48, frameHeight: 96 });
    this.load.spritesheet('npc-ryan', '/assets/sprites/Especialista4Ryan.png', { frameWidth: 48, frameHeight: 96 });
  }

  create() {
    // Fisica sem gravidade (top-down)
    this.physics.world.gravity.y = 0;

    createAllTopDownAnimations(this);

    this.mapBg = this.add.image(0, 0, 'mapa_clinica').setOrigin(0, 0);
    this.mapBg.setDepth(0);
    const mapBg = this.mapBg;

    // Bounds estritos baseados no tamanho real da imagem
    this.cameras.main.setBounds(0, 0, mapBg.displayWidth, mapBg.displayHeight);
    this.physics.world.setBounds(0, 0, mapBg.displayWidth, mapBg.displayHeight);

    this._buildRoomLabels();
    this.adminDecoratorSystem = new AdminDecoratorSystem(this);

    // Spawn do jogador
    const spawnPx = this._gridToPx(POSICAO_INICIAL.x, POSICAO_INICIAL.y);
    this.player = new PlayerTopDown(this, spawnPx.cx, spawnPx.cy);

    // Escala do jogador e hitbox nos pes
    this.player.setScale(0.65);
    if (this.player.body) {
      this.player.body.setSize(14, 14);
      this.player.body.setOffset(1, 18);
    }

    // Grupo de colisao estatico com Arcade Physics
    this.wallGroup = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.wallGroup);

    // Carrega os colliders definitivos no wallGroup
    this._buildColliders();

    // Camera
    setupCameraRigTopDown(this, this.player, mapBg.displayWidth, mapBg.displayHeight);
    this.cameras.main.setZoom(1.5);

    // NPCs e zonas de interacao
    this.interactionSystem = new InteractionSystem(this, this.player);
    this._buildNPCs();

    // Liga eventos com o React
    this._bindEvents();
    gameEventBus.emit('level:ready', { levelKey: 'clinica-td' });
    useGameStore.getState().setLevel?.('clinica-td', { x: spawnPx.cx, y: spawnPx.cy });

    this.events.once('shutdown', this._cleanup, this);
    this.events.once('destroy',  this._cleanup, this);
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

  /**
   * Cria as zonas de colisão estáticas definitivas no wallGroup.
   *
   * Dados exportados do Editor Visual — mapa 944×928 px, origem (0,0), escala 1:1.
   * x/y = centro do retângulo; width/height = dimensões.
   * Cada zone é criada com setOrigin(0.5, 0.5) e adicionada ao staticGroup.
   */
  _buildColliders() {
    const colliders = [
      { label: 'Colisor 5 (Cópia)',                       x: 203, y: 773, width:  20, height: 200 },
      { label: 'Colisor 7',                               x: 334, y: 153, width: 180, height:  40 },
      { label: 'Colisor 7 (Cópia)',                       x: 151, y: 153, width: 200, height:  40 },
      { label: 'Colisor 9',                               x:  46, y: 245, width:  16, height: 424 },
      { label: 'Colisor 10',                              x: 164, y: 364, width: 216, height:  24 },
      { label: 'Colisor 11',                              x: 341, y: 221, width: 156, height:  24 },
      { label: 'Colisor 11 (Cópia)',                      x: 545, y: 220, width: 160, height:  24 },
      { label: 'Colisor 11 (Cópia) (Cópia)',              x: 547, y: 236, width: 164, height:  40 },
      { label: 'Colisor 11 (Cópia) (Cópia) (Cópia)',     x: 342, y: 236, width: 156, height:  40 },
      { label: 'Colisor 15',                              x: 745, y: 366, width: 244, height:  24 },
      { label: 'Colisor 16',                              x: 860, y: 309, width:  44, height: 288 },
      { label: 'Colisor 15 (Cópia)',                      x: 179, y:  40, width: 188, height:  24 },
      { label: 'Colisor 15 (Cópia)',                      x: 212, y:  15, width: 244, height:  24 },
      { label: 'Colisor 19',                              x: 656, y: 152, width: 376, height:  40 },
      { label: 'Colisor 20',                              x: 619, y: 345, width:  20, height: 204 },
      { label: 'Colisor 20 (Cópia)',                      x: 619, y: 460, width:  20, height: 204 },
      { label: 'Colisor 22',                              x: 271, y: 307, width:  16, height: 144 },
      { label: 'Colisor 23',                              x: 499, y:  39, width: 292, height:   8 },
      { label: 'Colisor 24',                              x: 304, y:  27, width:  92, height:   8 },
      { label: 'Colisor 25',                              x: 264, y:  65, width:  20, height: 128 },
      { label: 'Colisor 25',                              x: 547, y: 567, width: 164, height:  44 },
      { label: 'Colisor 25 (Cópia)',                      x: 341, y: 566, width: 156, height:  44 },
      { label: 'Colisor 27',                              x: 271, y: 461, width:  16, height: 176 },
      { label: 'Colisor 28',                              x: 143, y: 482, width: 228, height:  24 },
      { label: 'Colisor 29',                              x:  42, y: 558, width:  20, height: 188 },
      { label: 'Colisor 30',                              x: 234, y: 649, width: 368, height:  44 },
      { label: 'Colisor 27',                              x: 301, y: 878, width: 248, height:  24 },
      { label: 'Colisor 27 (Cópia)',                      x: 544, y: 878, width: 272, height:  24 },
      { label: 'Colisor 29',                              x: 682, y: 789, width:  20, height: 228 },
      { label: 'Colisor 30',                              x: 490, y: 647, width:  48, height:  44 },
      { label: 'Colisor 30 (Cópia)',                      x: 659, y: 647, width:  56, height:  44 },
      { label: 'Colisor 32',                              x: 573, y: 659, width: 140, height:  68 },
      { label: 'Colisor 33',                              x: 278, y: 756, width:  80, height:  28 },
      { label: 'Colisor 34',                              x: 677, y: 503, width: 136, height:  24 },
      { label: 'Colisor 35',                              x: 770, y: 492, width: 160, height:   8 },
      { label: 'Colisor 36',                              x: 844, y: 529, width:  20, height: 248 },
      { label: 'Colisor 37',                              x: 733, y: 637, width: 204, height:  24 },
      { label: 'Colisor 38',                              x: 309, y:  84, width:  84, height:  24 },
      { label: 'Colisor 39',                              x: 622, y:  73, width:  24, height: 112 },
    ];

    colliders.forEach(({ x, y, width, height }) => {
      const zone = this.add.zone(x, y, width, height).setOrigin(0.5, 0.5);
      this.physics.add.existing(zone, true);
      this.wallGroup.add(zone);
    });
  }

  /**
   * Helper para criar e registrar um NPC individualmente.
   */
  _createNPC({ id, nome, fracX, fracY, spriteKey, tema, salaId, cor }) {
    const { displayWidth: W, displayHeight: H } = this.mapBg;
    const cx = W * fracX;
    const cy = H * fracY;

    // Resolve textura disponível (prioriza chave direta, depois aliases com hífen/underline)
    let resolvedKey = null;
    if (this.textures.exists(spriteKey)) {
      resolvedKey = spriteKey;
    } else if (this.textures.exists(spriteKey.replace('_', '-'))) {
      resolvedKey = spriteKey.replace('_', '-');
    } else if (this.textures.exists(spriteKey.replace('-', '_'))) {
      resolvedKey = spriteKey.replace('-', '_');
    }

    const visual = resolvedKey
      ? this.add.sprite(cx, cy, resolvedKey, 0).setScale(0.65).setOrigin(0.5, 1)
      : this.add.circle(cx, cy, 6, Phaser.Display.Color.HexStringToColor(cor || '#ffffff').color);
    visual.setDepth(DEPTH.PROPS_FRONT);

    // Animação idle suave (frames 0 a 2)
    if (resolvedKey) {
      const animKey = `${resolvedKey}-idle`;
      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(resolvedKey, { start: 0, end: 2 }),
          frameRate: 3,
          repeat: -1,
        });
      }
      visual.play(animKey);
    }

    // Label com nome do NPC acima da cabeça
    const labelY = visual.displayHeight ? cy - (visual.displayHeight + 4) : cy - 10;
    this.add.text(cx, labelY, nome, {
      fontSize: '4px',
      fontFamily: 'monospace',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5).setDepth(DEPTH.PROPS_FRONT + 1);

    // Registro da zona de interação
    const label = `FALAR COM ${nome.toUpperCase()} [X]`;
    this.interactionSystem.register(
      id,
      cx,
      cy,
      { width: 32, height: 32 },
      tema,
      label,
    );
    this.interactionSystem.setData(id, { npcId: id, salaId, tema, nome });

    return visual;
  }

  /** Cria sprites de NPC e registra no InteractionSystem (Hardcoded). */
  _buildNPCs() {
    // 1. Enrico - Recepção
    this._createNPC({
      id: 'enrico',
      nome: 'Enrico',
      fracX: 0.42,
      fracY: 0.85,
      spriteKey: 'npc_enrico',
      tema: 'recepcao',
      salaId: 'recepcao',
      cor: '#7fb3d5',
    });

    // 2. Nicolle - Sala 1 (Skincare & Fundamentos)
    this._createNPC({
      id: 'nicolle',
      nome: 'Nicolle',
      fracX: 0.18,
      fracY: 0.32,
      spriteKey: 'npc_nicolle',
      tema: 'Skincare & Fundamentos',
      salaId: 'sala1',
      cor: '#7fb3d5',
    });

    // 3. Henrique - Sala 2 (Toxina Botulínica)
    this._createNPC({
      id: 'henrique',
      nome: 'Henrique',
      fracX: 0.82,
      fracY: 0.32,
      spriteKey: 'npc_henrique',
      tema: 'Toxina Botulínica',
      salaId: 'sala2',
      cor: '#82c99a',
    });

    // 4. Felipe - Sala 3 (Bioestimuladores de Colágeno)
    this._createNPC({
      id: 'felipe',
      nome: 'Felipe',
      fracX: 0.18,
      fracY: 0.65,
      spriteKey: 'npc_felipe',
      tema: 'Bioestimuladores de Colágeno',
      salaId: 'sala3',
      cor: '#e0a96d',
    });

    // 5. Ryan - Sala 4 (Preenchimentos & Riscos Vasculares)
    this._createNPC({
      id: 'ryan',
      nome: 'Ryan',
      fracX: 0.82,
      fracY: 0.65,
      spriteKey: 'npc_ryan',
      tema: 'Preenchimentos & Riscos Vasculares',
      salaId: 'sala4',
      cor: '#d98080',
    });

    // 6. Dra. Bianca Cirilo - Sala 5 (Ácido Hialurônico Avançado / Sala Premium)
    const npcBianca = this._createNPC({
      id: 'dra_bianca',
      nome: 'Dra. Bianca Cirilo',
      fracX: 0.355,
      fracY: 0.15,
      spriteKey: 'npc_bianca',
      tema: 'Ácido Hialurônico Avançado',
      salaId: 'sala5',
      cor: '#c5a059',
    });
    npcBianca.setDepth(5);
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
      useGameStore.getState().setNearbyNpc(data ? {
        ...data,
        name: data.name || data.nome || data.label,
      } : null);
    });

    this._offInteract = this.events.on('player:interact', ({ type, id, data }) => {
      const npcDialogue = dialogueData[id];
      if (!npcDialogue) return;

      const gameStore = useGameStore.getState();
      const alreadyCompleted = gameStore.npcProgress[id]?.completed;
      const quizId = id === 'dra_bianca' ? 'bianca' : id;
      const hasQuiz = Boolean(quizData[quizId]);
      const phase = alreadyCompleted ? 'alreadyCompleted' : 'intro';

      gameStore.setActiveDialogue({
        npcId: id,
        lines: npcDialogue[phase] || [],
        currentLine: 0,
        phase,
        finished: false,
        hasQuiz: phase === 'intro' && hasQuiz,
      });
    });
  }

  _cleanup() {
    if (this._cleanedUp) return;
    this._cleanedUp = true;
    this.interactionSystem?.destroy();
    this.adminDecoratorSystem?.destroy();
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    // InteractionSystem ja se registra em scene.events.on('update') internamente
  }
}
