import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/storageKeys';

/**
 * SaveManager
 *
 * Sistema de salvamento preparado para o futuro. Futuramente salvará:
 * - XP, vida, arma, moedas, fase atual
 *
 * Hoje, apenas persiste o estado do jogador via storageService.
 * O slot de save padrão é "slot1" (expansível para múltiplos slots).
 *
 * @example
 * SaveManager.save({ xp: 50, coins: 12 });
 * const data = SaveManager.load();
 */
class SaveManager {
  constructor() {
    this.currentSlot = 'slot1';
  }

  /** Salva o estado do jogador no slot atual. */
  save(playerState) {
    const saveData = {
      ...playerState,
      savedAt: Date.now(),
      version: '1.0.0',
    };
    storageService.set(`${STORAGE_KEYS.PROGRESS}:${this.currentSlot}`, saveData);
    console.info('[SaveManager] Jogo salvo.');
  }

  /** Carrega o save do slot atual. Retorna null se não houver save. */
  load() {
    return storageService.get(`${STORAGE_KEYS.PROGRESS}:${this.currentSlot}`, null);
  }

  /** Verifica se existe um save no slot atual. */
  hasSave() {
    const data = this.load();
    return data !== null;
  }

  /** Apaga o save do slot atual. */
  delete() {
    storageService.remove(`${STORAGE_KEYS.PROGRESS}:${this.currentSlot}`);
    console.info('[SaveManager] Save deletado.');
  }

  /** Troca o slot ativo (para expansão futura com múltiplos slots). */
  setSlot(slot) {
    this.currentSlot = slot;
  }
}

export const saveManager = new SaveManager();
