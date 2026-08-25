/**
 * Chaves de persistência (LocalStorage).
 * A estrutura está pronta, mas o SALVAMENTO de progresso de jogo
 * ainda NÃO é utilizado nesta etapa — apenas preparado para o futuro.
 */
const NAMESPACE = 'clinicaEsteticaBC';

export const STORAGE_KEYS = {
  SETTINGS: `${NAMESPACE}:settings`,
  // Reservado para quando o sistema de progresso/save for implementado:
  PROGRESS: `${NAMESPACE}:progress`,
};
