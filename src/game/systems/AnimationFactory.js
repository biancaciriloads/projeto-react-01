/**
 * AnimationFactory
 *
 * Centraliza a criação das animações do jogador e dos elementos visuais
 * reutilizados pela cena de exploração. A lógica antiga de inimigos e armas
 * foi removida para preparar a base para o novo escopo.
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

  if (!anims.exists('player-airborne-anim')) {
    anims.create({
      key: 'player-airborne-anim',
      frames: anims.generateFrameNumbers('player-run', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: 0,
    });
  }
}

export function createAllAnimations(scene) {
  createPlayerAnimations(scene);
}

