import { create } from 'zustand';

/**
 * useGameSessionStore
 *
 * Controla apenas o estado de "navegação" entre telas React
 * (Início → Loading → Jogo). Não contém nenhuma lógica de gameplay —
 * isso vive dentro das Scenes do Phaser.
 */
export const VIEWS = {
  START: 'start',
  LOADING: 'loading',
  PLAYING: 'playing',
};

export const useGameSessionStore = create((set) => ({
  view: VIEWS.START,
  loadProgress: 0,

  startGame: () => set({ view: VIEWS.LOADING, loadProgress: 0 }),

  setLoadProgress: (progress) => set({ loadProgress: progress }),

  enterGame: () => set({ view: VIEWS.PLAYING }),

  returnToStart: () => set({ view: VIEWS.START, loadProgress: 0 }),
}));
