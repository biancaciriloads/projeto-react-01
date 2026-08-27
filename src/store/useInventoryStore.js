import { create } from 'zustand';

/**
 * useInventoryStore
 *
 * Gerencia as armas desbloqueadas e a arma atualmente equipada.
 * Separado do PlayerStore para não forçar re-render de toda a HUD
 * quando apenas o inventário mudar.
 */
export const useInventoryStore = create((set, get) => ({
  /** IDs das armas que o jogador possui. */
  unlockedWeapons: [],

  /** ID da arma equipada (null = sem arma). */
  equippedWeaponId: null,

  /** Desbloqueia uma arma. Sem efeito se já possuída. */
  unlockWeapon: (weaponId) => {
    if (get().unlockedWeapons.includes(weaponId)) return;
    set((s) => ({ unlockedWeapons: [...s.unlockedWeapons, weaponId] }));
  },

  /** Equipa uma arma desbloqueada. */
  equipWeapon: (weaponId) => {
    if (!get().unlockedWeapons.includes(weaponId)) return;
    set({ equippedWeaponId: weaponId });
  },

  /** Retorna o ID da arma equipada ou null. */
  getEquippedWeapon: () => get().equippedWeaponId,

  /** Desequipa qualquer arma (útil para reset de fase). */
  unequip: () => set({ equippedWeaponId: null }),
}));
