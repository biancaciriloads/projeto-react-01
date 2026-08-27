import { create } from 'zustand';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';

const DEFAULT_PLAYER = {
  hp: 100,
  maxHp: 100,
  xp: 0,
  coins: 0,
  keys: 0,
  currentWeaponId: null,
  unlockedWeapons: [],
};

const persisted = storageService.get(STORAGE_KEYS.PLAYER, DEFAULT_PLAYER);

/**
 * usePlayerStore
 *
 * Estado global do jogador (vida, XP, moedas, chaves, arma atual).
 * Persiste no localStorage via storageService para que o SaveManager
 * possa futuramente sincronizar o estado.
 *
 * O Phaser chama os métodos expostos pelo store via scene.events → store,
 * mas a HUD do React (componentes) também consome este store diretamente.
 */
export const usePlayerStore = create((set, get) => ({
  ...DEFAULT_PLAYER,
  ...persisted,

  setHp: (hp) => {
    const clamped = Math.max(0, Math.min(hp, get().maxHp));
    set({ hp: clamped });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: clamped });
  },

  takeDamage: (amount) => {
    const next = Math.max(0, get().hp - amount);
    set({ hp: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: next });
  },

  heal: (amount) => {
    const next = Math.min(get().maxHp, get().hp + amount);
    set({ hp: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: next });
  },

  addXp: (amount) => {
    const next = get().xp + amount;
    set({ xp: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), xp: next });
  },

  addCoins: (amount) => {
    const next = get().coins + amount;
    set({ coins: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), coins: next });
  },

  addKey: () => {
    const next = get().keys + 1;
    set({ keys: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), keys: next });
  },

  equipWeapon: (weaponId) => {
    if (!get().unlockedWeapons.includes(weaponId)) return;
    set({ currentWeaponId: weaponId });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), currentWeaponId: weaponId });
  },

  unlockWeapon: (weaponId) => {
    if (get().unlockedWeapons.includes(weaponId)) return;
    const next = [...get().unlockedWeapons, weaponId];
    set({ unlockedWeapons: next });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), unlockedWeapons: next });
  },

  respawn: (checkpoint) => {
    // Respawn no checkpoint: restaura HP, mantém progresso
    set({ hp: get().maxHp });
    storageService.set(STORAGE_KEYS.PLAYER, { ...get(), hp: get().maxHp });
  },
}));
