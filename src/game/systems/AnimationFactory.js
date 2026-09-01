/**
 * AnimationFactory
 *
 * Centraliza a criacao das animacoes do jogador — tanto as animacoes
 * side-scroller (legado) quanto as top-down (Gather.town).
 *
 * Top-down: usa player-idle e player-run como placeholder.
 * - td-idle-down / td-idle-up / td-idle-left / td-idle-right
 * - td-walk-down / td-walk-up / td-walk-left / td-walk-right
 */

// ---- Side-scroller (mantido para retrocompatibilidade) ----
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

  if (!anims.exists('player-airborne-anim')) {
    anims.create({
      key: 'player-airborne-anim',
      frames: anims.generateFrameNumbers('player-run', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: 0,
    });
  }
}

// ---- Top-down (Gather.town) ----
// Placeholder: reutiliza player-idle (12 frames) e player-run (12 frames).
// Quando houver spritesheets LPC dedicados, ajustar os indices de frames.
export function createTopDownAnimations(scene) {
  const { anims } = scene;

  // IDLE — frame unico por direcao (placeholder: frame 0 para todas)
  const idleConfigs = [
    { key: 'td-idle-down',  start: 0, end: 2 },
    { key: 'td-idle-up',    start: 0, end: 2 },
    { key: 'td-idle-left',  start: 0, end: 2 },
    { key: 'td-idle-right', start: 0, end: 2 },
  ];

  idleConfigs.forEach(({ key, start, end }) => {
    if (!anims.exists(key)) {
      anims.create({
        key,
        frames: anims.generateFrameNumbers('player-idle', { start, end }),
        frameRate: 4,
        repeat: -1,
      });
    }
  });

  // WALK — ciclo de caminhada (placeholder: usa player-run completo)
  const walkConfigs = [
    { key: 'td-walk-down',  start: 0, end: 5 },
    { key: 'td-walk-up',    start: 6, end: 11 },
    { key: 'td-walk-left',  start: 0, end: 5 },
    { key: 'td-walk-right', start: 6, end: 11 },
  ];

  walkConfigs.forEach(({ key, start, end }) => {
    if (!anims.exists(key)) {
      anims.create({
        key,
        frames: anims.generateFrameNumbers('player-run', { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    }
  });
}

export function createAllAnimations(scene) {
  createPlayerAnimations(scene);
}

export function createAllTopDownAnimations(scene) {
  createTopDownAnimations(scene);
}
