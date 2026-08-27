import { create } from 'zustand';

/**
 * useProgressStore
 *
 * Rastreia progresso da fase atual:
 * - Se a chave foi coletada
 * - Se a porta foi aberta
 * - Checkpoints ativados
 * - Último checkpoint (ponto de respawn)
 */
export const useProgressStore = create((set, get) => ({
  currentLevel: null,
  hasKey: false,
  isDoorOpen: false,
  checkpointsActivated: [],
  lastCheckpoint: { x: 60, y: 184 }, // padrão = spawn inicial

  /** Marca que o jogador coletou a chave. */
  collectKey: () => set({ hasKey: true }),

  /** Marca que a porta foi aberta. */
  openDoor: () => set({ isDoorOpen: true }),

  /** Registra um checkpoint como ativado e o define como ponto de respawn. */
  activateCheckpoint: ({ x, y }) => {
    const key = `${x}:${y}`;
    if (get().checkpointsActivated.includes(key)) return;
    set((s) => ({
      checkpointsActivated: [...s.checkpointsActivated, key],
      lastCheckpoint: { x, y },
    }));
  },

  /** Define manualmente o último checkpoint (chamado ao ativar checkpoint interativo). */
  setLastCheckpoint: (x, y) => set({ lastCheckpoint: { x, y } }),

  /** Reseta todo o progresso da fase. */
  resetLevel: () => set({
    hasKey: false,
    isDoorOpen: false,
    checkpointsActivated: [],
    lastCheckpoint: { x: 60, y: 184 },
  }),

  /** Define a fase atual. */
  setCurrentLevel: (levelKey) => set({ currentLevel: levelKey }),
}));
