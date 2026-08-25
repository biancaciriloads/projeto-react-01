import { CAMERA } from '../../constants/gameSettings';

/**
 * CameraRig
 *
 * Configura a câmera principal de uma Scene: seguir o jogador, dead zone,
 * zoom pixel-perfect e limites do mundo. Isolado em um helper para não
 * poluir a Scene com detalhes de câmera.
 */
export function setupCameraRig(scene, target, worldWidth, worldHeight) {
  const cam = scene.cameras.main;

  cam.setBounds(0, 0, worldWidth, worldHeight);
  cam.setZoom(CAMERA.ZOOM);
  cam.startFollow(target, true, CAMERA.LERP, CAMERA.LERP);
  cam.setDeadzone(CAMERA.DEAD_ZONE_WIDTH, CAMERA.DEAD_ZONE_HEIGHT);
  cam.setRoundPixels(true); // pixel-perfect: evita "tremida" em pixel art

  return cam;
}
