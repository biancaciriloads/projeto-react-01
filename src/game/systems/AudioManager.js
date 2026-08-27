import { Howl } from 'howler';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useSettingsStore } from '../../store/useSettingsStore';

/**
 * AudioManager
 *
 * Wrapper sobre Howler para tocar sons e música. Preparado para ser
 * integrado às Scenes do Phaser.
 *
 * Sons ainda NÃO são tocados nesta etapa — a estrutura está pronta.
 * Cada método verifica se o áudio existe antes de tocar, evitando erros
 * quando o asset não foi carregado.
 *
 * @example
 * AudioManager.play('coin');
 * AudioManager.play('jump', { volume: 0.5 });
 * AudioManager.music('bgm-01', { loop: true });
 */
class AudioManager {
  constructor() {
    /** Map<soundId, Howl> */
    this.sounds = new Map();
    /** Map<soundId, Howl> */
    this.music = new Map();
    this.currentMusic = null;
  }

  /**
   * Registra um som (sfx) para ser tocado posteriormente.
   * @param {string} id  - nome interno do som
   * @param {string} src - caminho a partir de /public
   * @param {object} opts - opções Howl (volume, rate, etc.)
   */
  registerSound(id, src, opts = {}) {
    const settings = useSettingsStore.getState();
    const howl = new Howl({
      src: [src],
      volume: settings.muted ? 0 : settings.masterVolume,
      ...opts,
    });
    this.sounds.set(id, howl);
  }

  /**
   * Registra uma música de fundo.
   * @param {string} id  - nome interno da música
   * @param {string} src - caminho a partir de /public
   * @param {object} opts - opções Howl (loop: true, etc.)
   */
  registerMusic(id, src, opts = {}) {
    const settings = useSettingsStore.getState();
    const howl = new Howl({
      src: [src],
      volume: settings.muted ? 0 : settings.masterVolume * 0.6,
      loop: true,
      ...opts,
    });
    this.music.set(id, howl);
  }

  /** Toca um sfx pelo id. Retorna o Howl para poder pará-lo. */
  play(soundId, opts = {}) {
    const howl = this.sounds.get(soundId);
    if (!howl) {
      console.warn(`[AudioManager] Som "${soundId}" não registrado.`);
      return null;
    }
    const settings = useSettingsStore.getState();
    howl.volume(settings.muted ? 0 : settings.masterVolume);
    howl.play();
    return howl;
  }

  /** Para um sfx específico. */
  stop(soundId) {
    const howl = this.sounds.get(soundId);
    if (howl) howl.stop();
  }

  /** Toca e mantém uma música de fundo, parando a anterior. */
  playMusic(musicId, opts = {}) {
    const howl = this.music.get(musicId);
    if (!howl) {
      console.warn(`[AudioManager] Música "${musicId}" não registrada.`);
      return null;
    }
    const settings = useSettingsStore.getState();
    howl.volume(settings.muted ? 0 : settings.masterVolume * 0.6);
    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, 300);
      setTimeout(() => this.currentMusic?.stop(), 320);
    }
    howl.play();
    this.currentMusic = howl;
    return howl;
  }

  /** Pausa a música atual. */
  pauseMusic() {
    if (this.currentMusic) this.currentMusic.pause();
  }

  /** Retoma a música pausada. */
  resumeMusic() {
    if (this.currentMusic) this.currentMusic.play();
  }

  /** Para toda a música. */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  /** Atualiza o volume de todos os sons ativos. Chamar após mudança no SettingsStore. */
  refreshVolume() {
    const settings = useSettingsStore.getState();
    const vol = settings.muted ? 0 : settings.masterVolume;

    this.sounds.forEach((howl) => howl.volume(vol));

    if (this.currentMusic) {
      this.currentMusic.volume(vol * 0.6);
    }
  }

  /**
   * Descarta todos os sons e limpa a memória.
   * Usado ao trocar de cena ou encerrar o jogo.
   */
  destroy() {
    this.sounds.forEach((howl) => howl.unload());
    this.music.forEach((howl) => howl.unload());
    this.sounds.clear();
    this.music.clear();
    this.currentMusic = null;
  }
}

export const audioManager = new AudioManager();
