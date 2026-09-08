// Matriz da clinica em coordenadas de grid (colunas x linhas).
// Somente #, G, D e . chegam ao grid final; os nomes da planta viram piso.

const NEW_MAP_LAYOUT = [
  '#################################################',
  '#################...............#################',
  '#################.....BIANCA....#################',
  '#################...............#################',
  '########################D########################',
  '########################D########################',
  '#.......##.............................##.......#',
  '#.......DD........CORREDOR.SUPERIOR....DD.......#',
  '#NICOLLE##.............................##..RYAN.#',
  '#.......###############DDD###############.......#',
  '#.......#####.......................#####.......#',
  '#############.......................#############',
  '#############....SALAO.DE.ESPERA....#############',
  '#############.......................#############',
  '#.......#####.......................#####.......#',
  '#.......###############DDD###############.......#',
  '#HENRIQU##.............................##.FELIPE#',
  '#.......DD........CORREDOR.INFERIOR....DD.......#',
  '#.......##.............................##.......#',
  '#######################DDD#######################',
  '#################...............#################',
  'GGGGGGGGG########...............########GGGGGGGGG',
  'GGGGGGGGG########....RECEPCAO...########GGGGGGGGG',
  'GGGGGGGGG########.....ENRICO....########GGGGGGGGG',
  'GGGGGGGGG###############################GGGGGGGGG',
];

export const GRID_WIDTH = NEW_MAP_LAYOUT[0].length;
export const GRID_HEIGHT = NEW_MAP_LAYOUT.length;
export const TILE_W = 64;
export const TILE_H = 32;

// Retangulos de piso usados para posicionar rotulos dentro das salas.
export const ROOMS = {
  entrada: { id: 'entrada', nome: 'Entrada', tipo: 'entrada', rect: { x: 24, y: 19, w: 2, h: 2 } },
  recepcao: { id: 'recepcao', nome: 'Recepcao Enrico', tipo: 'recepcao', rect: { x: 17, y: 20, w: 15, h: 4 } },
  sala5: { id: 'sala5', nome: 'Consultorio Bianca', tipo: 'consultorio-grande', rect: { x: 17, y: 1, w: 15, h: 3 } },
  sala1: { id: 'sala1', nome: 'Consultorio Nicolle', tipo: 'consultorio', rect: { x: 1, y: 6, w: 7, h: 5 } },
  sala4: { id: 'sala4', nome: 'Consultorio Ryan', tipo: 'consultorio', rect: { x: 41, y: 6, w: 7, h: 5 } },
  espera: { id: 'espera', nome: 'Salao de Espera', tipo: 'espera', rect: { x: 13, y: 10, w: 23, h: 9 } },
  sala2: { id: 'sala2', nome: 'Consultorio Henrique', tipo: 'consultorio', rect: { x: 1, y: 14, w: 7, h: 5 } },
  sala3: { id: 'sala3', nome: 'Consultorio Felipe', tipo: 'consultorio', rect: { x: 41, y: 14, w: 7, h: 5 } },
};

function sanitizarLinha(linha) {
  return [...linha].map((tile) => (
    tile === '#' || tile === 'G' || tile === 'D' || tile === '.' ? tile : '.'
  ));
}

export function gerarGrid() {
  return NEW_MAP_LAYOUT.map(sanitizarLinha);
}

export function tileEhCaminhavel(grid, x, y) {
  if (y < 0 || y >= GRID_HEIGHT || x < 0 || x >= GRID_WIDTH) return false;
  return grid[y][x] === '.' || grid[y][x] === 'D';
}

export function centroDaSala(rect) {
  return {
    x: Math.floor(rect.x + rect.w / 2),
    y: Math.floor(rect.y + rect.h / 2),
  };
}

export function gridParaIso(x, y) {
  return {
    left: (x - y) * (TILE_W / 2),
    top: (x + y) * (TILE_H / 2),
  };
}

export const POSICAO_INICIAL = { x: 24, y: 21 };

export const NPCS = [
  { id: 'enrico', salaId: 'recepcao', nome: 'Enrico', tema: 'recepcao', cor: '#7fb3d5', spriteKey: 'npc-enrico', pos: { x: 24, y: 22 } },
  { id: 'nicolle', salaId: 'sala1', nome: 'Nicolle', tema: 'Skincare & Fundamentos', cor: '#7fb3d5', pos: { x: 4, y: 8 } },
  { id: 'henrique', salaId: 'sala2', nome: 'Henrique', tema: 'Toxina Botulínica', cor: '#82c99a', pos: { x: 4, y: 16 } },
  { id: 'felipe', salaId: 'sala3', nome: 'Felipe', tema: 'Bioestimuladores de Colágeno', cor: '#e0a96d', pos: { x: 44, y: 16 } },
  { id: 'ryan', salaId: 'sala4', nome: 'Ryan', tema: 'Preenchimentos & Riscos Vasculares', cor: '#d98080', pos: { x: 44, y: 8 } },
  { id: 'dra_bianca', salaId: 'sala5', nome: 'Dra. Bianca Cirilo', tema: 'Ácido Hialurônico Avançado', cor: '#c5a059', pos: { x: 24, y: 2 } },
];
