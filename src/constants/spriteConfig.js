/**
 * spriteConfig.js — Configuração de Fatiamento Automático de Sprites
 *
 * Formato dos sprite sheets: LPC (Liberated Pixel Cup)
 *   - 384 × 224 px total
 *   - 12 colunas × 7 linhas
 *   - Cada frame = 32 × 32 px
 *
 * Layout de linhas (padrão LPC para walk cycle):
 *   Linha 0 (row 0): Subindo   (up)    — walk north
 *   Linha 1 (row 1): Esquerda  (left)  — walk west
 *   Linha 2 (row 2): Descendo  (down)  — walk south
 *   Linha 3 (row 3): Direita   (right) — walk east
 *
 * Dentro de cada linha de walk:
 *   Col 0: pose de pé (idle) — frame neutro
 *   Cols 1–8: passos de caminhada (8 frames)
 *   Cols 9–11: frames extras / variação
 *
 * Para animação idle simples, usamos apenas col 0 de cada direção.
 * Para walk animation, usamos cols 1–8 (8 frames).
 */

// ── Dimensões base do sprite ──────────────────────────────────────────────────
export const SPRITE_FRAME_W  = 32;   // largura de 1 frame (px)
export const SPRITE_FRAME_H  = 32;   // altura de 1 frame (px)
export const SPRITE_COLS     = 12;   // colunas no sheet completo
export const SPRITE_ROWS     = 7;    // linhas  no sheet completo

// ── Mapeamento de direção → linha da spritesheet (LPC) ───────────────────────
export const DIRECTION_ROW = {
  up:    0,
  left:  1,
  down:  2,
  right: 3,
};

// ── Definição das animações ───────────────────────────────────────────────────
//   startCol: coluna inicial (inclusiva)
//   endCol:   coluna final   (inclusiva)
//   fps:      quadros por segundo da animação
export const ANIMATIONS = {
  /**
   * idle: frame estático em pé, coluna 0 de cada direção
   * Usa apenas 1 frame — não precisa loop.
   */
  idle: {
    startCol: 0,
    endCol:   0,
    fps:      4,
  },

  /**
   * walk: 8 frames de caminhada (colunas 1–8)
   * Loop contínuo enquanto o personagem se move.
   */
  walk: {
    startCol: 1,
    endCol:   8,
    fps:      8,
  },
};

// ── Duração de cada frame (ms) ────────────────────────────────────────────────
export const getFrameDuration = (animName) => {
  const anim = ANIMATIONS[animName];
  return anim ? Math.floor(1000 / anim.fps) : 125;
};

// ── Número de frames de uma animação ─────────────────────────────────────────
export const getFrameCount = (animName) => {
  const anim = ANIMATIONS[animName];
  if (!anim) return 1;
  return anim.endCol - anim.startCol + 1;
};

/**
 * getSpriteStyle — Calcula o `backgroundPosition` para um frame específico.
 *
 * @param {string}  sheetUrl   URL pública do sprite sheet
 * @param {string}  direction  'up' | 'down' | 'left' | 'right'
 * @param {string}  animName   'idle' | 'walk'
 * @param {number}  frame      índice do frame dentro da animação (0-based)
 * @param {number}  [scale=1] fator de escala para renderização
 * @returns {Object} estilo CSS pronto para uso no componente
 */
export const getSpriteStyle = (sheetUrl, direction, animName, frame = 0, scale = 1) => {
  const anim = ANIMATIONS[animName] || ANIMATIONS.idle;
  const row  = DIRECTION_ROW[direction] ?? DIRECTION_ROW.down;

  // Clamp do frame dentro do intervalo da animação
  const totalFrames = anim.endCol - anim.startCol + 1;
  const clampedFrame = Math.max(0, Math.min(frame, totalFrames - 1));

  const col = anim.startCol + clampedFrame;

  // background-position: move a imagem para expor o frame correto
  const posX = -(col * SPRITE_FRAME_W  * scale);
  const posY = -(row * SPRITE_FRAME_H  * scale);

  const displayW = SPRITE_FRAME_W  * scale;
  const displayH = SPRITE_FRAME_H  * scale;
  const bgW      = SPRITE_COLS * SPRITE_FRAME_W  * scale;
  const bgH      = SPRITE_ROWS * SPRITE_FRAME_H  * scale;

  return {
    width:               `${displayW}px`,
    height:              `${displayH}px`,
    backgroundImage:     `url("${sheetUrl}")`,
    backgroundPosition:  `${posX}px ${posY}px`,
    backgroundSize:      `${bgW}px ${bgH}px`,
    backgroundRepeat:    'no-repeat',
    imageRendering:      'pixelated',
  };
};

// ── Configuração de sprites por personagem ────────────────────────────────────
//
//   sheet:  caminho público do sprite sheet completo (384×224)
//   idle:   caminho do sprite idle estático (64×32) — 2 frames, só down
//
// Mapeamento: npcId → arquivos de sprite
export const CHARACTER_SPRITES = {
  // ── Player ──
  player: {
    sheet: '/assets/characters/player/adam-full-sheet.png',
    idle:  '/assets/characters/player/adam-idle.png',
  },

  // ── NPCs ──
  enrico: {
    sheet: '/assets/characters/npc/alex/alex-full-sheet.png',
    idle:  '/assets/characters/npc/alex/alex-idle.png',
  },
  nicolle: {
    sheet: '/assets/characters/npc/bob/bob-full-sheet.png',
    idle:  '/assets/characters/npc/bob/bob-idle.png',
  },
  henrique: {
    sheet: '/assets/characters/npc/alex/alex-full-sheet.png',
    idle:  '/assets/characters/npc/alex/alex-idle.png',
  },
  felipe: {
    sheet: '/assets/characters/npc/amelia/amelia-full-sheet.png',
    idle:  '/assets/characters/npc/amelia/amelia-idle.png',
  },
  ryan: {
    sheet: '/assets/characters/npc/bob/bob-full-sheet.png',
    idle:  '/assets/characters/npc/bob/bob-idle.png',
  },
  dra_bianca: {
    sheet: '/assets/characters/npc/amelia/amelia-full-sheet.png',
    idle:  '/assets/characters/npc/amelia/amelia-idle.png',
  },
};

/**
 * getCharacterSheet — Retorna o caminho do sprite sheet de um personagem.
 * Retorna o sprite do player como fallback se o personagem não for encontrado.
 *
 * @param {string} characterId  id do personagem (npcId ou 'player')
 * @returns {string} URL pública do sprite sheet
 */
export const getCharacterSheet = (characterId) => {
  return CHARACTER_SPRITES[characterId]?.sheet
    ?? CHARACTER_SPRITES.player.sheet;
};
