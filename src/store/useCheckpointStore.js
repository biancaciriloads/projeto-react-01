import { create } from 'zustand';
import { storageService } from '../services/storageService';

const STORAGE_KEY = 'ESTETICA_CHECKPOINTS';

const DEFAULT_CHECKPOINTS = {
  checkpointsAtivos: [],
  ultimoCheckpoint: null,
};

const persisted = storageService.get(STORAGE_KEY, DEFAULT_CHECKPOINTS);

/**
 * useCheckpointStore
 * 
 * Gerencia os checkpoints desbloqueados e o último checkpoint alcançado 
 * pelo jogador para spawn e saves de longo prazo.
 */
export const useCheckpointStore = create((set, get) => ({
  ...DEFAULT_CHECKPOINTS,
  ...persisted,

  salvarCheckpoint: (id, spawnData) => {
    const state = get();
    const jaExiste = state.checkpointsAtivos.find(c => c.id === id);
    
    let newState;
    if (jaExiste) {
      newState = { ultimoCheckpoint: { id, ...spawnData } };
    } else {
      newState = {
        checkpointsAtivos: [...state.checkpointsAtivos, { id, ...spawnData }],
        ultimoCheckpoint: { id, ...spawnData }
      };
    }
    
    set(newState);
    storageService.set(STORAGE_KEY, { ...get(), ...newState });
  },

  setUltimoCheckpoint: (id) => {
    const state = get();
    const cp = state.checkpointsAtivos.find(c => c.id === id);
    if (cp) {
      set({ ultimoCheckpoint: cp });
      storageService.set(STORAGE_KEY, { ...get(), ultimoCheckpoint: cp });
    }
  },

  limparCheckpoints: () => {
    set({ checkpointsAtivos: [], ultimoCheckpoint: null });
    storageService.remove(STORAGE_KEY);
  }
}));
