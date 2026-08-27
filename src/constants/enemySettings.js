/**
 * Configurações dos inimigos.
 * Centralizado para facilitar balanceamento sem caçar números no código.
 */

export const ENEMY_STATS = {
  'sol-uv': {
    hp: 60,
    speed: 40,
    damage: 15,
    xpReward: 20,
    shootRange: 200,
    shootCooldown: 3000,
    patrolRange: 80,
  },
  'oleosidade': {
    hp: 100,
    speed: 25,
    damage: 20,
    xpReward: 30,
    chaseRange: 250,
    knockbackExtra: 100,
  },
  'bacteria': {
    hp: 30,
    speed: 80,
    damage: 10,
    xpReward: 10,
    chaseRange: 300,
  },
};

export const BOSS_STATS = {
  'sol-uv-gigante': {
    hp: 500,
    speed: 30,
    damage: 25,
    xpReward: 200,
    phases: 2,
    shootRange: 300,
    shootCooldown: 2000,
    patrolRange: 120,
  },
};
