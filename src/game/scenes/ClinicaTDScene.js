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

    // Grupo de colisao estatico
    this.wallGroup = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.wallGroup);

    // Colisao frontal da mesa da Dra. Bianca
    const deskZone = this.add.zone(mapBg.displayWidth * 0.355, mapBg.displayHeight * 0.155, 64, 24).setOrigin(0.5, 0.5);
    this.physics.add.existing(deskZone, true);
    this.wallGroup.add(deskZone);

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
