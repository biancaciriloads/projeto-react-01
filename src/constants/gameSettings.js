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
  // Movimento horizontal
  PLAYER_SPEED: 110,          // velocidade máxima horizontal
  ACCELERATION: 600,          // aceleração ao acelerar
  DRAG: 400,                  // desaceleração ao soltar direção
  AIR_ACCELERATION: 400,      // controle no ar (menor que no chão)
  AIR_DRAG: 100,              // menos arrasto no ar = mais controle
  // Pulo
  PLAYER_JUMP_VELOCITY: 320,  // velocidade inicial do pulo
  MAX_FALL_SPEED: 600,        // velocidade máxima de queda
  // Pulo variável: gravidade extra aplicada quando solta o botão de pulo
  VARIABLE_JUMP_MULTIPLIER: 2.5,
  // Coyote Time: ms após sair da plataforma que ainda pode pular
  COYOTE_TIME: 100,
  // Jump Buffer: ms antes de pousar que aceita comando de pulo
  JUMP_BUFFER: 120,
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
  COIN: 8,
  KEY: 8,
  PROPS_BACK: 5,
  PLATFORMS: 10,
  PROPS_FRONT: 15,
  PLAYER: 20,
  ENEMY: 21,
  PROJECTILE: 22,
  FOREGROUND: 30,
  HUD: 100,
};
