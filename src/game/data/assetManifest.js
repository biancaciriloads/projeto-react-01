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
  { key: 'npc-enrico', path: `${BASE}/sprites/RecepcionistaEnrico.png`, frameWidth: 48, frameHeight: 96 },
  { key: 'npc-nicolle', path: `${BASE}/sprites/Especialista1Nicolle.png`, frameWidth: 48, frameHeight: 96 },
  { key: 'npc-henrique', path: `${BASE}/sprites/Especialista2Henrique.png`, frameWidth: 48, frameHeight: 96 },
  { key: 'npc-felipe', path: `${BASE}/sprites/Especialista3Felipe.png`, frameWidth: 48, frameHeight: 96 },
  { key: 'npc-ryan', path: `${BASE}/sprites/Especialista4Ryan.png`, frameWidth: 48, frameHeight: 96 },
  { key: 'npc-bianca', path: `${BASE}/sprites/EspecialistaMestreBiancaCirilo.png`, frameWidth: 48, frameHeight: 96 },
];

export const PORTRAIT_IMAGES = [
  { key: 'portrait-tv-clinica', path: `${BASE}/portraits/tvclinica.png` },
  { key: 'portrait-enrico', path: `${BASE}/portraits/RecepcionistaEnricoPerfil.png` },
  { key: 'portrait-player', path: `${BASE}/portraits/PlayerPerfil.png` },
  { key: 'portrait-nicolle', path: `${BASE}/portraits/EspecialistaNicollePerfil.png` },
  { key: 'portrait-henrique', path: `${BASE}/portraits/EspecialistaHenriquePerfil.png` },
  { key: 'portrait-felipe', path: `${BASE}/portraits/EspecialistaFelipePerfil.png` },
  { key: 'portrait-ryan', path: `${BASE}/portraits/EspecialistaRyanPerfil.png` },
  { key: 'portrait-bianca', path: `${BASE}/portraits/Dra.BiancaPerfil.png` },
];

/** Tilesets usados para montar plataformas e cenário (grade de 16x16). */
export const TILESET_SPRITESHEETS = [
  { key: 'tiles-room-builder', path: `${BASE}/tilesets/interiors/room-builder_16x16.png`, frameWidth: 16, frameHeight: 16 },
  { key: 'tiles-interiors', path: `${BASE}/tilesets/interiors/interiors_16x16.png`, frameWidth: 16, frameHeight: 16 },
  { key: 'tiles-room-builder-32', path: `${BASE}/tilesets/interiors/variants/room-builder_32x32.png`, frameWidth: 32, frameHeight: 32 },
  { key: 'tiles-room-builder-48', path: `${BASE}/tilesets/interiors/variants/room-builder_48x48.png`, frameWidth: 48, frameHeight: 48 },
  { key: 'tiles-interiors-32', path: `${BASE}/tilesets/interiors/variants/interiors_32x32.png`, frameWidth: 32, frameHeight: 32 },
  { key: 'tiles-interiors-48', path: `${BASE}/tilesets/interiors/variants/interiors_48x48.png`, frameWidth: 48, frameHeight: 48 },
  {
    key: 'tiles-clinic-48',
    path: `${BASE}/tilesets/Modern_Interiors_Free_v2.216bit/Modern tiles_Free/Interiors_free/48x48/Room_Builder_free_48x48.png`,
    frameWidth: 48,
    frameHeight: 48,
  },
  { key: 'tiles-interiors-free-48', path: `${BASE}/tilesets/Modern_Interiors_Free_v2.216bit/Modern tiles_Free/Interiors_free/48x48/Interiors_free_48x48.png`, frameWidth: 48, frameHeight: 48 },
];

export const ARCHITECTURE_IMAGES = [
  { key: 'door-ward-single', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_door_ward_single_01.png` },
  { key: 'door-double-swing', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_door_double_swing_01.png` },
  { key: 'wall-ward-straight', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_wall_ward_straight_01.png` },
  { key: 'wall-doorway', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_wall_doorway_01.png` },
  { key: 'floor-linoleum-white', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_floor_linoleum_white_01.png` },
  { key: 'floor-linoleum-green', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_floor_linoleum_green_01.png` },
  { key: 'floor-corridor-antislip', path: `${BASE}/tilesets/ModernHospital2DPropsPack_v1.0/Tiles/Architecture/hospital_architecture_floor_corridor_antislip_01.png` },
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
  { key: 'prop-table-meal-v', path: `${BASE}/props/clinic/room_table_meal_v.png` },
  { key: 'prop-table-meal-h', path: `${BASE}/props/clinic/room_table_meal_h.png` },
  { key: 'prop-bed-v', path: `${BASE}/props/clinic/room_bed_v.png` },
  { key: 'prop-bed-h', path: `${BASE}/props/clinic/room_bed_h.png` },
  { key: 'prop-bedside-table', path: `${BASE}/props/clinic/room_bedside_table.png` },
  { key: 'prop-pharmacy-shelf', path: `${BASE}/props/clinic/room_pharmacy_shelf.png` },
  { key: 'prop-ecg-cart', path: `${BASE}/props/clinic/room_ecg_cart.png` },
  { key: 'prop-operation-table', path: `${BASE}/props/clinic/operation_table.png` },
  { key: 'prop-operation-light', path: `${BASE}/props/clinic/operation_light.png` },
  { key: 'prop-lab-sink', path: `${BASE}/props/clinic/lab_sink.png` },
  { key: 'prop-lab-refrigerator', path: `${BASE}/props/clinic/lab_refrigerator.png` },
  { key: 'prop-lab-microscope', path: `${BASE}/props/clinic/lab_microscope_v.png` },
  { key: 'prop-maternity-chair', path: `${BASE}/props/clinic/maternity_chair.png` },
  { key: 'prop-maternity-bed', path: `${BASE}/props/clinic/maternity_bed.png` },
  { key: 'prop-maternity-table', path: `${BASE}/props/clinic/maternity_table.png` },
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
    images: [...PORTRAIT_IMAGES, ...ARCHITECTURE_IMAGES, ...PROP_IMAGES, ...UI_IMAGES],
  };
}
