/**
 * Manifesto de assets.
 *
 * Único lugar do projeto que conhece os caminhos físicos dos arquivos em
 * `public/assets`. O PreloadScene apenas percorre estas listas — nenhuma
 * outra parte do código deve referenciar um caminho de asset diretamente.
 *
 * Isso permite reorganizar pastas no futuro alterando um único arquivo.
 */

const BASE = '/assets';

/** Spritesheets do jogador (32x32 por frame, 12 frames). */
export const PLAYER_SPRITESHEETS = [
  { key: 'player-custom', path: `${BASE}/sprites/player.png`, frameWidth: 48, frameHeight: 96 },
];

/** Tilesets usados para montar plataformas e cenário (grade de 16x16). */
export const TILESET_SPRITESHEETS = [
  { key: 'tiles-room-builder', path: `${BASE}/tilesets/interiors/room-builder_16x16.png`, frameWidth: 16, frameHeight: 16 },
  { key: 'tiles-interiors', path: `${BASE}/tilesets/interiors/interiors_16x16.png`, frameWidth: 16, frameHeight: 16 },
];

/**
 * Imagens estáticas (props de decoração / obstáculos visuais).
 * "Caixas" e "barris" do protótipo usam os móveis/latões do pack hospitalar
 * (não há crates/barrels literais nos packs fornecidos — ver README de decisões).
 */
export const PROP_IMAGES = [
  { key: 'prop-cabinet', path: `${BASE}/props/clinic/room_cabinet.png` },
  { key: 'prop-wooden-cabinet', path: `${BASE}/props/clinic/lab_wooden_cabinet.png` },
  { key: 'prop-trash-bin', path: `${BASE}/props/clinic/room_trash_bin.png` },
  { key: 'prop-biohazard-bin', path: `${BASE}/props/clinic/room_biohazard_bin.png` },
  { key: 'prop-armchair', path: `${BASE}/props/clinic/room_armchair.png` },
  { key: 'prop-pine-tree', path: `${BASE}/environment/nature/props/pine-tree.png` },
  { key: 'prop-plant-aloe', path: `${BASE}/environment/nature/props/plant-aloe.png` },
  { key: 'prop-cactus', path: `${BASE}/environment/nature/props/cactus-tall.png` },
];

/** UI (telas React usam via CSS/<img>, mas registradas aqui para uso futuro no Phaser, ex. HUD). */
export const UI_IMAGES = [
  { key: 'ui-pixel-transparent', path: `${BASE}/ui/pixel/spritesheet/uipack-transparent.png` },
];

export const COLLECTIBLE_SPRITESHEETS = [
  { key: 'coin', path: `${BASE}/collectibles/coin.png`, frameWidth: 16, frameHeight: 16 },
];

export function getAllManifestEntries() {
  return {
    spritesheets: [...PLAYER_SPRITESHEETS, ...TILESET_SPRITESHEETS, ...COLLECTIBLE_SPRITESHEETS],
    images: [...PROP_IMAGES, ...UI_IMAGES],
  };
}
