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

// ---- Top-down (Gather.town) ----
// Placeholder: reutiliza player-idle (12 frames) e player-run (12 frames).
// Quando houver spritesheets LPC dedicados, ajustar os indices de frames.
export function createTopDownAnimations(scene) {
  const { anims } = scene;

  // IDLE — frames 0-2 de cada direcao do spritesheet personalizado
  const idleConfigs = [
    { key: 'td-idle-down',  start: 0, end: 2 },
    { key: 'td-idle-left',  start: 12, end: 14 },
    { key: 'td-idle-right', start: 24, end: 26 },
    { key: 'td-idle-up',    start: 36, end: 38 },
  ];

  idleConfigs.forEach(({ key, start, end }) => {
    if (!anims.exists(key)) {
      anims.create({
        key,
        frames: anims.generateFrameNumbers('player-custom', { start, end }),
        frameRate: 4,
        repeat: -1,
      });
    }
  });

  // WALK — frames 3-8 de cada direcao do spritesheet personalizado
  const walkConfigs = [
    { key: 'td-walk-down',  start: 0, end: 5 },
    { key: 'td-walk-left',  start: 15, end: 20 },
    { key: 'td-walk-right', start: 27, end: 32 },
    { key: 'td-walk-up',    start: 39, end: 44 },
  ];

  walkConfigs.forEach(({ key, start, end }) => {
    if (!anims.exists(key)) {
      anims.create({
        key,
        frames: anims.generateFrameNumbers('player-custom', { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    }
  });
}

export function createAllTopDownAnimations(scene) {
  createTopDownAnimations(scene);
}
