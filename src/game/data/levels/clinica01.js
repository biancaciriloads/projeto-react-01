import { TILE_SIZE } from '../../../constants/gameSettings';

/**
 * Layout da primeira fase (protótipo).
 *
 * Nesta etapa o nível é montado a partir de dados simples (arrays de
 * posição), sem um editor Tiled — suficiente para validar a arquitetura.
 * Quando o jogo crescer, este arquivo pode ser substituído por um mapa
 * `.json` exportado do Tiled sem alterar a Scene (ela só consome dados).
 *
 * Convenções:
 * - Coordenadas em pixels, tile de referência = 16px.
 * - `groundTileFrame` / `platformTileFrame`: índice do frame dentro do
 *   spritesheet `tiles-room-builder` (ver public/assets/tilesets/interiors).
 */

const FLOOR_Y = 224; // topo do piso
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 270;

export const clinica01Level = {
  key: 'clinica-01',
  name: 'Clínica Estética BC — Corredor de Entrada',

  world: {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
  },

  // Ponto onde o player nasce (Entrada da clínica).
  spawnPoint: { x: 60, y: FLOOR_Y - 40 },

  // Marcador de fim de corredor (apenas visual/trigger nesta etapa —
  // a lógica de "desbloquear próxima clínica" fica para uma fase futura).
  endTrigger: { x: WORLD_WIDTH - 80, y: FLOOR_Y - 24, width: 24, height: 48 },

  // Piso contínuo do corredor inteiro (tileado horizontalmente).
  ground: {
    tileFrame: 206, // madeira clara — ver tilesets/interiors/room-builder_16x16.png
    y: FLOOR_Y,
    tileSize: TILE_SIZE,
    startX: 0,
    endX: WORLD_WIDTH,
  },

  // Plataformas flutuantes soltas ao longo do corredor.
  platforms: [
    { tileFrame: 341, y: FLOOR_Y - 64, startX: 420, widthInTiles: 4 },
    { tileFrame: 341, y: FLOOR_Y - 100, startX: 620, widthInTiles: 3 },
    { tileFrame: 341, y: FLOOR_Y - 64, startX: 820, widthInTiles: 4 },
    { tileFrame: 341, y: FLOOR_Y - 80, startX: 1400, widthInTiles: 5 },
    { tileFrame: 341, y: FLOOR_Y - 64, startX: 1900, widthInTiles: 4 },
  ],

  // Props decorativos/obstáculos estáticos (recepção, móveis, plantas).
  // `solid: true` gera corpo físico estático (o jogador colide/pode subir em cima).
  props: [
    // --- Recepção (logo após a entrada) ---
    { key: 'prop-armchair', x: 140, y: FLOOR_Y, solid: true },
    { key: 'prop-cabinet', x: 190, y: FLOOR_Y, solid: true },
    { key: 'prop-plant-aloe', x: 90, y: FLOOR_Y, solid: false },

    // --- Primeiro corredor: "caixas" e "barris" (armários/latões) ---
    { key: 'prop-wooden-cabinet', x: 340, y: FLOOR_Y, solid: true },
    { key: 'prop-trash-bin', x: 500, y: FLOOR_Y, solid: true },
    { key: 'prop-biohazard-bin', x: 760, y: FLOOR_Y, solid: true },
    { key: 'prop-wooden-cabinet', x: 1080, y: FLOOR_Y, solid: true },
    { key: 'prop-trash-bin', x: 1250, y: FLOOR_Y, solid: true },

    // --- Plantas espalhadas pelo corredor ---
    { key: 'prop-pine-tree', x: 600, y: FLOOR_Y, solid: false },
    { key: 'prop-cactus', x: 980, y: FLOOR_Y, solid: false },
    { key: 'prop-plant-aloe', x: 1600, y: FLOOR_Y, solid: false },
    { key: 'prop-pine-tree', x: 2200, y: FLOOR_Y, solid: false },

    // --- Fim do corredor ---
    { key: 'prop-cabinet', x: WORLD_WIDTH - 160, y: FLOOR_Y, solid: true },
    { key: 'prop-armchair', x: WORLD_WIDTH - 110, y: FLOOR_Y, solid: true },
  ],

  // Moedas espalhadas pelo corredor
  coins: [
    { x: 200, y: FLOOR_Y - 20 },
    { x: 320, y: FLOOR_Y - 20 },
    { x: 450, y: FLOOR_Y - 80 }, // cima da plataforma
    { x: 640, y: FLOOR_Y - 116 }, // plataforma alta
    { x: 850, y: FLOOR_Y - 80 },
    { x: 1100, y: FLOOR_Y - 20 },
    { x: 1430, y: FLOOR_Y - 96 }, // plataforma
    { x: 1700, y: FLOOR_Y - 20 },
    { x: 2400, y: FLOOR_Y - 20 },
    { x: 2700, y: FLOOR_Y - 20 },
  ],

  // Baús
  chests: [
    { x: 550, y: FLOOR_Y },
    { x: 2000, y: FLOOR_Y },
  ],

  // Chave (escondida mais no final do corredor)
  keyItem: { x: 2500, y: FLOOR_Y - 20 },

  // Porta final
  door: { x: WORLD_WIDTH - 50, y: FLOOR_Y },

  // Checkpoints ao longo do corredor
  checkpoints: [
    { x: 700, y: FLOOR_Y },
    { x: 1600, y: FLOOR_Y },
  ],

  // Inimigos
  enemies: [
    { type: 'sol-uv', x: 400, y: FLOOR_Y - 40 },
    { type: 'bacteria', x: 650, y: FLOOR_Y - 40 },
    { type: 'bacteria', x: 750, y: FLOOR_Y - 40 },
    { type: 'sol-uv', x: 900, y: FLOOR_Y - 40 },
    { type: 'oleosidade', x: 1150, y: FLOOR_Y - 40 },
    { type: 'bacteria', x: 1300, y: FLOOR_Y - 40 },
    { type: 'sol-uv', x: 1500, y: FLOOR_Y - 40 },
    { type: 'oleosidade', x: 1800, y: FLOOR_Y - 40 },
    { type: 'bacteria', x: 2100, y: FLOOR_Y - 40 },
    { type: 'sol-uv', x: 2600, y: FLOOR_Y - 40 },
    { type: 'oleosidade', x: 2800, y: FLOOR_Y - 40 },
  ],
};
