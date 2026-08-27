/**
 * AnimationFactory
 *
 * Centraliza a criação das animações do jogador. Mantém a definição de
 * frames/fps em um único lugar, longe da lógica de estado do Player.
 *
 * As spritesheets `player-idle` e `player-run` têm 12 frames (32x32) cada.
 * Não existem frames dedicados de "jump"/"fall" no pack — usamos um frame
 * fixo do idle como pose provisória até um asset dedicado ser adicionado
 * (documentado também no README de decisões de arte).
 */
export function createPlayerAnimations(scene) {
  const { anims } = scene;

  if (!anims.exists('player-idle-anim')) {
    anims.create({
      key: 'player-idle-anim',
      frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!anims.exists('player-run-anim')) {
    anims.create({
      key: 'player-run-anim',
      frames: anims.generateFrameNumbers('player-run', { start: 0, end: 11 }),
      frameRate: 14,
      repeat: -1,
    });
  }

  // Pose estática usada para os estados de pulo/queda (sem asset dedicado).
  if (!anims.exists('player-airborne-anim')) {
    anims.create({
      key: 'player-airborne-anim',
      frames: anims.generateFrameNumbers('player-run', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: 0,
    });
  }
}

/** Animações dos inimigos — usando spritesheets do player como PLACEHOLDER.
 * NOTA: Substituir por spritesheets reais de inimigos quando disponíveis. */
export function createEnemyAnimations(scene) {
  const { anims } = scene;
  
  // Sol UV — placeholder usa player-idle/run
  if (!anims.exists('sol-uv-idle')) anims.create({ key: 'sol-uv-idle', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 11 }), frameRate: 6, repeat: -1 });
  if (!anims.exists('sol-uv-walk')) anims.create({ key: 'sol-uv-walk', frames: anims.generateFrameNumbers('player-run', { start: 0, end: 11 }), frameRate: 8, repeat: -1 });
  if (!anims.exists('sol-uv-hit')) anims.create({ key: 'sol-uv-hit', frames: anims.generateFrameNumbers('player-run', { start: 6, end: 6 }), frameRate: 1, repeat: 0 });
  if (!anims.exists('sol-uv-death')) anims.create({ key: 'sol-uv-death', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }), frameRate: 8, repeat: 0 });
  
  // Oleosidade — placeholder
  if (!anims.exists('oleosidade-idle')) anims.create({ key: 'oleosidade-idle', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 11 }), frameRate: 4, repeat: -1 });
  if (!anims.exists('oleosidade-walk')) anims.create({ key: 'oleosidade-walk', frames: anims.generateFrameNumbers('player-run', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
  if (!anims.exists('oleosidade-hit')) anims.create({ key: 'oleosidade-hit', frames: anims.generateFrameNumbers('player-run', { start: 6, end: 6 }), frameRate: 1, repeat: 0 });
  if (!anims.exists('oleosidade-death')) anims.create({ key: 'oleosidade-death', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }), frameRate: 8, repeat: 0 });
  
  // Bacteria — placeholder
  if (!anims.exists('bacteria-idle')) anims.create({ key: 'bacteria-idle', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 11 }), frameRate: 12, repeat: -1 });
  if (!anims.exists('bacteria-walk')) anims.create({ key: 'bacteria-walk', frames: anims.generateFrameNumbers('player-run', { start: 0, end: 11 }), frameRate: 16, repeat: -1 });
  if (!anims.exists('bacteria-hit')) anims.create({ key: 'bacteria-hit', frames: anims.generateFrameNumbers('player-run', { start: 6, end: 6 }), frameRate: 1, repeat: 0 });
  if (!anims.exists('bacteria-death')) anims.create({ key: 'bacteria-death', frames: anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }), frameRate: 12, repeat: 0 });
}

/** Animação da moeda — movida de Coin.js para evitar duplicação. */
export function createCoinAnimation(scene) {
  const { anims } = scene;
  if (!anims.exists('coin-idle-anim')) {
    anims.create({
      key: 'coin-idle-anim',
      frames: anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}

/** Chama todas as factories de animação. */
export function createAllAnimations(scene) {
  createPlayerAnimations(scene);
  createEnemyAnimations(scene);
  createCoinAnimation(scene);
}
