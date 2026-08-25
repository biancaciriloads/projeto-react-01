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
