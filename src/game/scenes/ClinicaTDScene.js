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

const COLLISION_EDITOR = true;


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

    // Camera
    setupCameraRigTopDown(this, this.player, mapBg.displayWidth, mapBg.displayHeight);
    this.cameras.main.setZoom(1.5);

    // Inicializa o Editor Visual Temporario de Colisoes (COLLISION_EDITOR)
    this._initCollisionEditor();

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
    this._cleanupCollisionEditor();
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    // InteractionSystem ja se registra em scene.events.on('update') internamente
  }

  // =========================================================================
  // EDITOR VISUAL TEMPORÁRIO DE COLISÕES (In-Scene)
  // =========================================================================

  _initCollisionEditor() {
    this.collisionEditorActive = COLLISION_EDITOR;
    this.selectedCollider = null;
    this.isDraggingCollider = false;
    this.dragOffset = { x: 0, y: 0 };

    // Lista de caixas de colisão no mapa (944x928)
    // Inicializa com a colisão frontal da mesa da Bianca
    this.collisionBoxes = [
      {
        id: 1,
        label: 'Mesa Dra. Bianca',
        x: Math.round(this.mapBg.displayWidth * 0.355), // 335
        y: Math.round(this.mapBg.displayHeight * 0.155), // 144
        width: 64,
        height: 24,
      },
    ];

    // Registra os colliders estáticos no wallGroup
    this.collisionBoxes.forEach((box) => this._syncBoxPhysics(box));

    // Camada gráfica para desenhar as caixas de colisão sobre o mapa
    this.editorGraphics = this.add.graphics().setDepth(200);
    this.editorWorldLabels = [];

    // Interface de debug fixa na tela (scrollFactor 0)
    this._createEditorDebugUI();

    // Eventos de entrada para seleção e arrasto
    this._bindEditorInputEvents();

    // Renderiza inicialmente
    this._renderCollisionEditor();
  }

  /** Cria ou sincroniza a zona física estática no wallGroup. */
  _syncBoxPhysics(box) {
    if (box.zone && box.zone.destroy) {
      box.zone.destroy();
    }
    const zone = this.add.zone(box.x, box.y, box.width, box.height).setOrigin(0.5, 0.5);
    this.physics.add.existing(zone, true);
    this.wallGroup.add(zone);
    box.zone = zone;
  }

  /** Identifica se o ponteiro clicou no interior de algum collider existente. */
  _findColliderAt(wx, wy) {
    for (let i = this.collisionBoxes.length - 1; i >= 0; i--) {
      const b = this.collisionBoxes[i];
      const body = b.zone?.body;
      const left = body ? body.left : b.x - b.width / 2;
      const top = body ? body.top : b.y - b.height / 2;
      const width = body ? body.width : b.width;
      const height = body ? body.height : b.height;
      if (
        wx >= left &&
        wx <= left + width &&
        wy >= top &&
        wy <= top + height
      ) {
        return b;
      }
    }
    return null;
  }

  _bindEditorInputEvents() {
    this.onEditorPointerDown = (pointer) => {
      if (!this.collisionEditorActive) return;

      // Se clicou na barra de debug fixa no topo (Y < 28), não processa no mundo
      if (pointer.y < 28) return;

      const clicked = this._findColliderAt(pointer.worldX, pointer.worldY);
      if (clicked) {
        this.selectedCollider = clicked;
        this.isDraggingCollider = true;
        this.dragOffset = {
          x: pointer.worldX - clicked.x,
          y: pointer.worldY - clicked.y,
        };
      } else {
        this.selectedCollider = null;
        this.isDraggingCollider = false;
      }
      this._renderCollisionEditor();
    };

    this.onEditorPointerMove = (pointer) => {
      if (!this.collisionEditorActive || !this.isDraggingCollider || !this.selectedCollider) return;

      // Move o collider selecionado arrastando o seu interior
      this.selectedCollider.x = Math.round(pointer.worldX - this.dragOffset.x);
      this.selectedCollider.y = Math.round(pointer.worldY - this.dragOffset.y);

      this._syncBoxPhysics(this.selectedCollider);
      this._renderCollisionEditor();
    };

    this.onEditorPointerUp = () => {
      if (this.isDraggingCollider) {
        this.isDraggingCollider = false;
        this._renderCollisionEditor();
      }
    };

    this.input.on('pointerdown', this.onEditorPointerDown);
    this.input.on('pointermove', this.onEditorPointerMove);
    this.input.on('pointerup', this.onEditorPointerUp);

    // Tecla F2 para alternar rapidamente entre modo editor e jogo
    this.onEditorKeyDown = (event) => {
      if (event.key === 'F2') {
        this._toggleEditorMode();
      } else if (this.collisionEditorActive && this.selectedCollider) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          this._removeSelectedCollider();
        } else if (event.key.toLowerCase() === 'd') {
          this._duplicateSelectedCollider();
        }
      }
    };
    this.input.keyboard?.on('keydown', this.onEditorKeyDown);
  }

  _alignEditorDebugUI() {
    if (!this.editorUiContainer) return;
    const cam = this.cameras.main;
    const zoom = cam.zoom || 1;
    const cx = cam.width / 2;
    const cy = cam.height / 2;
    this.editorUiContainer.setPosition(cx * (1 - 1 / zoom), cy * (1 - 1 / zoom));
    this.editorUiContainer.setScale(1 / zoom);
  }

  _createEditorDebugUI() {
    this.editorUiContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(300);

    const barHeight = 28;

    // Barra de fundo fixa no topo
    const barBg = this.add.rectangle(0, 0, 480, barHeight, 0x14141e, 0.94)
      .setOrigin(0, 0)
      .setInteractive();
    this.editorUiContainer.add(barBg);

    const barBorder = this.add.rectangle(0, barHeight, 480, 1, 0xffcc00, 0.7).setOrigin(0, 0);
    this.editorUiContainer.add(barBorder);

    const createButton = (x, y, label, color, onClick) => {
      const btnH = 13;
      const btnTxt = this.add.text(x + 4, y + 2, label, {
        fontSize: '7px',
        fontFamily: 'monospace',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      const width = Math.round(btnTxt.width + 8);
      const btnBg = this.add.rectangle(x, y, width, btnH, color, 0.9)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true });
      btnBg.on('pointerdown', (ptr, lx, ly, event) => {
        event?.stopPropagation();
        onClick();
      });
      btnBg.on('pointerover', () => btnBg.setAlpha(1));
      btnBg.on('pointerout', () => btnBg.setAlpha(0.9));

      this.editorUiContainer.add([btnBg, btnTxt]);
      return { btnBg, btnTxt, width };
    };

    let currX = 4;

    // Botão Alternar Modo Editor / Jogo Normal
    this.editorToggleBtn = createButton(currX, 3, this.collisionEditorActive ? '🛠️ EDIT: ON' : '🎮 JOGO', 0x1f6feb, () => {
      this._toggleEditorMode();
    });
    currX += this.editorToggleBtn.width + 4;

    // Botão + NOVO Collider
    const newBtn = createButton(currX, 3, '+ NOVO', 0x238636, () => {
      this._createNewCollider();
    });
    currX += newBtn.width + 4;

    // Botão DUPLICAR
    const dupBtn = createButton(currX, 3, '📋 DUPL', 0x8957e5, () => {
      this._duplicateSelectedCollider();
    });
    currX += dupBtn.width + 4;

    // Botão REMOVER
    const delBtn = createButton(currX, 3, '🗑️ DEL', 0xda3633, () => {
      this._removeSelectedCollider();
    });
    currX += delBtn.width + 4;

    // Ajuste de Tamanho W e H
    const wDec = createButton(currX, 3, 'W-', 0x30363d, () => this._resizeSelectedCollider(-4, 0));
    currX += wDec.width + 2;
    const wInc = createButton(currX, 3, 'W+', 0x30363d, () => this._resizeSelectedCollider(4, 0));
    currX += wInc.width + 3;
    const hDec = createButton(currX, 3, 'H-', 0x30363d, () => this._resizeSelectedCollider(0, -4));
    currX += hDec.width + 2;
    const hInc = createButton(currX, 3, 'H+', 0x30363d, () => this._resizeSelectedCollider(0, 4));
    currX += hInc.width + 4;

    // Botão EXPORTAR
    const expBtn = createButton(currX, 3, '💾 EXPORT', 0xd29922, () => {
      this._exportColliders();
    });
    currX += expBtn.width + 4;

    // Texto de status e coordenadas do collider selecionado
    this.editorStatusText = this.add.text(4, 18, '', {
      fontSize: '6px',
      fontFamily: 'monospace',
      color: '#ffdd66',
    });
    this.editorUiContainer.add(this.editorStatusText);

    this._alignEditorDebugUI();
  }

  _toggleEditorMode() {
    this.collisionEditorActive = !this.collisionEditorActive;
    if (this.editorToggleBtn) {
      this.editorToggleBtn.btnTxt.setText(this.collisionEditorActive ? '🛠️ EDIT: ON' : '🎮 JOGO');
      const newWidth = Math.round(this.editorToggleBtn.btnTxt.width + 8);
      this.editorToggleBtn.btnBg.setSize(newWidth, 13);
    }
    this.selectedCollider = null;
    this.isDraggingCollider = false;
    this._renderCollisionEditor();
  }

  _createNewCollider() {
    // Posiciona no centro visível da câmera ou ponto padrão
    const cx = Math.round(this.cameras.main.worldView.centerX || 472);
    const cy = Math.round(this.cameras.main.worldView.centerY || 464);
    const newBox = {
      id: Date.now(),
      label: `Colisor ${this.collisionBoxes.length + 1}`,
      x: cx,
      y: cy,
      width: 48,
      height: 24,
    };
    this.collisionBoxes.push(newBox);
    this._syncBoxPhysics(newBox);
    this.selectedCollider = newBox;
    this._renderCollisionEditor();
  }

  _duplicateSelectedCollider() {
    if (!this.selectedCollider) return;
    const newBox = {
      id: Date.now(),
      label: `${this.selectedCollider.label} (Cópia)`,
      x: this.selectedCollider.x + 16,
      y: this.selectedCollider.y + 16,
      width: this.selectedCollider.width,
      height: this.selectedCollider.height,
    };
    this.collisionBoxes.push(newBox);
    this._syncBoxPhysics(newBox);
    this.selectedCollider = newBox;
    this._renderCollisionEditor();
  }

  _removeSelectedCollider() {
    if (!this.selectedCollider) return;
    if (this.selectedCollider.zone && this.selectedCollider.zone.destroy) {
      this.selectedCollider.zone.destroy();
    }
    this.collisionBoxes = this.collisionBoxes.filter((b) => b !== this.selectedCollider);
    this.selectedCollider = null;
    this._renderCollisionEditor();
  }

  _resizeSelectedCollider(deltaW, deltaH) {
    if (!this.selectedCollider) return;
    this.selectedCollider.width = Math.max(8, this.selectedCollider.width + deltaW);
    this.selectedCollider.height = Math.max(8, this.selectedCollider.height + deltaH);
    this._syncBoxPhysics(this.selectedCollider);
    this._renderCollisionEditor();
  }

  _exportColliders() {
    const list = this.collisionBoxes.map(({ label, x, y, width, height }) => ({
      label,
      x,
      y,
      width,
      height,
    }));
    const jsonStr = JSON.stringify(list, null, 2);
    console.log('[ClinicaTDScene] Colisões Atuais:\n', jsonStr);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonStr).catch(() => {});
    }
    if (this.editorStatusText) {
      this.editorStatusText.setText('✅ JSON copiado para o Clipboard e exibido no console (F12)!');
      this.time.delayedCall(2500, () => this._updateStatusText());
    }
  }

  _updateStatusText() {
    if (!this.editorStatusText) return;
    if (!this.collisionEditorActive) {
      this.editorStatusText.setText('MODO JOGO ATIVO. Colliders invisíveis. Clique [JOGO] ou F2 para abrir o editor.');
      return;
    }
    if (this.selectedCollider) {
      const b = this.selectedCollider;
      const body = b.zone?.body;
      const left = Math.round(body ? body.left : b.x - b.width / 2);
      const top = Math.round(body ? body.top : b.y - b.height / 2);
      const width = Math.round(body ? body.width : b.width);
      const height = Math.round(body ? body.height : b.height);
      this.editorStatusText.setText(
        `SEL: ${b.label} | Centro: (${b.x}, ${b.y}) | Tam: ${width}x${height} | Top-Left: (${left}, ${top})`
      );
    } else {
      this.editorStatusText.setText(
        `EDITOR ATIVO (${this.collisionBoxes.length} colliders). Clique para selecionar e arraste para mover.`
      );
    }
  }

  _renderCollisionEditor() {
    this.editorGraphics.clear();

    // Remove rótulos visuais de mundo anteriores
    this.editorWorldLabels.forEach((lbl) => lbl.destroy());
    this.editorWorldLabels = [];

    this._updateStatusText();

    // Se o editor estiver desativado, colliders permanecem 100% invisíveis
    if (!this.collisionEditorActive) return;

    this.collisionBoxes.forEach((box) => {
      const isSelected = box === this.selectedCollider;
      const body = box.zone?.body;
      const left = body ? body.left : box.x - box.width / 2;
      const top = body ? body.top : box.y - box.height / 2;
      const width = body ? body.width : box.width;
      const height = body ? body.height : box.height;

      if (isSelected) {
        // Preenchimento Amarelo / Dourado para o selecionado
        this.editorGraphics.fillStyle(0xffff00, 0.45);
        this.editorGraphics.fillRect(left, top, width, height);

        this.editorGraphics.lineStyle(2, 0xffff00, 1);
        this.editorGraphics.strokeRect(left, top, width, height);

        // Indicador central
        const centerX = body?.center ? body.center.x : (left + width / 2);
        const centerY = body?.center ? body.center.y : (top + height / 2);
        this.editorGraphics.fillStyle(0xffffff, 1);
        this.editorGraphics.fillRect(centerX - 2, centerY - 2, 4, 4);
      } else {
        // Preenchimento Vermelho translúcido para os demais
        this.editorGraphics.fillStyle(0xff2222, 0.3);
        this.editorGraphics.fillRect(left, top, width, height);

        this.editorGraphics.lineStyle(1.5, 0xff0000, 0.85);
        this.editorGraphics.strokeRect(left, top, width, height);
      }

      // Rótulo com dimensões e posição sobre o PNG
      const labelText = this.add.text(
        left + 2,
        top + 2,
        `${box.label || ''}\n${width}x${height} (${Math.round(left)},${Math.round(top)})`,
        {
          fontSize: '5px',
          fontFamily: 'monospace',
          color: isSelected ? '#ffff00' : '#ffffff',
          backgroundColor: '#000000bb',
          padding: { x: 2, y: 1 },
        }
      ).setDepth(201);
      this.editorWorldLabels.push(labelText);
    });
  }

  _cleanupCollisionEditor() {
    this.input.off('pointerdown', this.onEditorPointerDown);
    this.input.off('pointermove', this.onEditorPointerMove);
    this.input.off('pointerup', this.onEditorPointerUp);
    if (this.onEditorKeyDown) {
      this.input.keyboard?.off('keydown', this.onEditorKeyDown);
    }

    this.editorGraphics?.destroy();
    this.editorWorldLabels?.forEach((lbl) => lbl.destroy());
    this.editorUiContainer?.destroy();
  }
}
