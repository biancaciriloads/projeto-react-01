/**
 * storageService
 *
 * Wrapper simples e seguro sobre `localStorage`. Preparado para o futuro
 * sistema de salvamento de progresso — hoje só é usado para persistir
 * preferências leves (ex.: configurações de áudio), nunca gameplay.
 */
function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storageService] Falha ao ler "${key}":`, error);
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storageService] Falha ao gravar "${key}":`, error);
    return false;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storageService] Falha ao remover "${key}":`, error);
  }
}

export const storageService = { get, set, remove };
