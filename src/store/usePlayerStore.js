import { create } from 'zustand';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';

const DEFAULT_PLAYER = {
  hp: 100,
  maxHp: 100,
  isDead: false,
  respawnPoint: { x: 60, y: 184 },
};

const persisted = storageService.get(STORAGE_KEYS.PLAYER, DEFAULT_PLAYER);

/**
 * usePlayerStore
 *
 * Estado mínimo do jogador para a nova base de exploração.
 * A lógica antiga de XP, moedas, chave e itens foi removida.
 */
export const usePlayerStore = create((set, get) => ({
  ...DEFAULT_PLAYER,
  ...persisted,

  setHp: (hp) => {
    const clamped = Math.max(0, Math.min(hp, get().maxHp));
    set({ hp: clamped, isDead: clamped <= 0 });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: clamped, isDead: clamped <= 0 });
  },

  setRespawnPoint: (respawnPoint) => {
    set({ respawnPoint });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), respawnPoint });
  },

  respawn: (checkpoint) => {
    const nextCheckpoint = checkpoint || get().respawnPoint || { x: 60, y: 184 };
    set({ hp: get().maxHp, isDead: false, respawnPoint: nextCheckpoint });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: get().maxHp, isDead: false, respawnPoint: nextCheckpoint });
  },
}));
