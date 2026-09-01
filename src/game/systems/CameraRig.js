import { CAMERA } from '../../constants/gameSettings';

/**
 * CameraRig
 *
 * Configura a camera principal de uma Scene.
 * Expoe duas variacoes:
 *  - setupCameraRig        : para cenas side-scroller (zoom 2x)
 *  - setupCameraRigTopDown : para cenas top-down (zoom 3x, sem deadzone)
 */

/** Camera para cena side-scroller original. */
export function setupCameraRig(scene, target, worldWidth, worldHeight) {
  const cam = scene.cameras.main;

  cam.setBounds(0, 0, worldWidth, worldHeight);
  cam.setZoom(CAMERA.ZOOM);
  cam.startFollow(target, true, CAMERA.LERP, CAMERA.LERP);
  cam.setDeadzone(CAMERA.DEAD_ZONE_WIDTH, CAMERA.DEAD_ZONE_HEIGHT);
  cam.setRoundPixels(true);

  return cam;
}

/** Camera para cena top-down (Gather.town style). */
export function setupCameraRigTopDown(scene, target, worldWidth, worldHeight) {
  const cam = scene.cameras.main;

  cam.setBounds(0, 0, worldWidth, worldHeight);
  cam.setZoom(3);            // zoom maior para pixel art top-down
  cam.startFollow(target, true, 0.08, 0.08);
  cam.setRoundPixels(true);

  return cam;
}
