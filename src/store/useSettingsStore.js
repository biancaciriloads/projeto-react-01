import { create } from 'zustand';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';

const persisted = storageService.get(STORAGE_KEYS.SETTINGS, {});

/**
 * useSettingsStore
 *
 * Estrutura preparada para configurações de áudio (volume/mute). Nenhum
 * som é reproduzido ainda — os valores só ficam prontos para quando o
 * `audioService` for efetivamente ligado à Scene em uma etapa futura.
 */
export const useSettingsStore = create((set, get) => ({
  masterVolume: persisted.masterVolume ?? 0.7,
  muted: persisted.muted ?? false,

  setMasterVolume: (value) => {
    set({ masterVolume: value });
    storageService.set(STORAGE_KEYS.SETTINGS, {
      masterVolume: value,
      muted: get().muted,
    });
  },

  toggleMuted: () => {
    const nextMuted = !get().muted;
    set({ muted: nextMuted });
    storageService.set(STORAGE_KEYS.SETTINGS, {
      masterVolume: get().masterVolume,
      muted: nextMuted,
    });
  },
}));
