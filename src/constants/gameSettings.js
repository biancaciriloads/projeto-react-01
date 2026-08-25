/**
 * Configurações globais do jogo.
 * Mantidas em um único lugar para facilitar balanceamento futuro
 * (ex.: ajustar velocidade do jogador sem caçar números pelo código).
 */

// Resolução base do canvas. O jogo roda em baixa resolução (pixel art)
// e é escalado para cima via Phaser.Scale — mantém os pixels nítidos.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

// Tamanho base dos tiles usados nos tilesets (Modern Interiors / Hospital).
export const TILE_SIZE = 16;

// Física (Arcade Physics).
export const PHYSICS = {
  GRAVITY_Y: 900,
  PLAYER_SPEED: 110,
  PLAYER_JUMP_VELOCITY: 320,
  MAX_FALL_SPEED: 600,
};

// Câmera.
export const CAMERA = {
  ZOOM: 2,
  DEAD_ZONE_WIDTH: 60,
  DEAD_ZONE_HEIGHT: 40,
  LERP: 0.1,
};

// Profundidades (z-index) padronizadas para organizar camadas de render.
export const DEPTH = {
  BACKGROUND: 0,
  PROPS_BACK: 5,
  PLATFORMS: 10,
  PROPS_FRONT: 15,
  PLAYER: 20,
  FOREGROUND: 30,
};
