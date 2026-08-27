/**
 * Configurações das armas.
 * Centralizado para facilitar adição de novas armas e balanceamento.
 *
 * effectType: null | 'frozen' | 'burn'
 */

export const WEAPON_STATS = {
  'microagulhamento': {
    damage: 12,
    fireRate: 400,        // ms entre disparos
    projectileSpeed: 350,
    range: 200,
    effectType: null,
  },
  'laser-estetico': {
    damage: 20,
    fireRate: 800,
    projectileSpeed: 500,
    range: 400,
    effectType: null,
  },
  'chicote-radiofrequencia': {
    damage: 30,
    fireRate: 600,
    projectileSpeed: 0,   // melee — sem projétil
    range: 60,
    effectType: null,
  },
  'spray-criogenico': {
    damage: 8,
    fireRate: 700,
    projectileSpeed: 250,
    range: 180,
    effectType: 'frozen',
  },
  // Arma final — implementada mas NÃO desbloqueada nesta etapa.
  'plasma-pen': {
    damage: 50,
    fireRate: 1200,
    projectileSpeed: 600,
    range: 500,
    effectType: 'burn',
  },
};
