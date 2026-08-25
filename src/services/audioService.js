import { Howl } from 'howler';

/**
 * audioService
 *
 * Estrutura pronta para tocar efeitos sonoros e música via Howler.
 * NENHUM som é registrado ou tocado nesta etapa — apenas a API está
 * preparada para quando o sistema de áudio for implementado.
 *
 * Uso futuro esperado:
 *   audioService.register('click', '/assets/audio/sfx/ui/click_001.ogg');
 *   audioService.play('click');
 */
const sounds = new Map();

function register(key, src, options = {}) {
  if (sounds.has(key)) return;
  sounds.set(key, new Howl({ src: [src], ...options }));
}

function play(key) {
  const sound = sounds.get(key);
  if (sound) sound.play();
}

function stop(key) {
  const sound = sounds.get(key);
  if (sound) sound.stop();
}

function setMuted(muted) {
  sounds.forEach((sound) => sound.mute(muted));
}

export const audioService = { register, play, stop, setMuted };
