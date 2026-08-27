import { create } from 'zustand';

/**
 * useGameStore
 *
 * Estado de gameplay: cena atual, checkpoints, entidades interativas
 * próximas, prompt "PRESSIONE X" e flags de fim de fase. Mantido
 * separado do PlayerStore para que a UI/HUD não precise re-renderizar
 * quando o gameplay muda.
 */
export const useGameStore = create((set) => ({
  currentLevel: null,
  currentCheckpoint: { x: 0, y: 0 },
  nearbyInteractable: null, // { type, label } | null
  levelComplete: false,

  setLevel: (levelKey, spawn) =>
    set({ currentLevel: levelKey, currentCheckpoint: spawn, levelComplete: false }),

  setCheckpoint: (x, y) => set({ currentCheckpoint: { x, y } }),

  setNearby: (interactable) => set({ nearbyInteractable: interactable }),

  markLevelComplete: () => set({ levelComplete: true }),

  reset: () =>
    set({
      currentLevel: null,
      currentCheckpoint: { x: 0, y: 0 },
      nearbyInteractable: null,
      levelComplete: false,
    }),
}));
