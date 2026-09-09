// Matriz da clinica em coordenadas de grid (colunas x linhas).
// Somente #, G, D e . chegam ao grid final; os nomes da planta viram piso.

const NEW_MAP_LAYOUT = [
  '#################################################',
  '##############.......BIANCA........##############',
  '##############.....................##############',
  '##############.....................##############',
  '##############.....................##############',
  '##############.....................##############',
  '##############.....................##############',
  '#..........#############D#############..........#',
  '#..........#.........................#..........#',
  '#..........D......CORREDOR.SUPERIOR..D..........#',
  '#NICOLLE...#.........................#.....RYAN.#',
  '#..........############DDD############..........#',
  '#..........##.......................##..........#',
  '#..........##.......................##..........#',
  '#############....SALÃO.DE.ESPERA....#############',
  '#############.......................#############',
  '#..........##.......................##..........#',
  '#..........##.......................##..........#',
  '#..........############DDD############..........#',
  '#.HENRIQUE.#.........................#..FELIPE..#',
  '#..........D......CORREDOR.INFERIOR..D..........#',
  '#..........#.........................#..........#',
  '#..........############DDD############..........#',
  '#############.......................#############',
  'GGGGGGGGG####.......................####GGGGGGGGG',
  'GGGGGGGGG####........RECEPÇÃO.......####GGGGGGGGG',
  'GGGGGGGGG####.........ENRICO........####GGGGGGGGG',
  'GGGGGGGGG####.......................####GGGGGGGGG',
  'GGGGGGGGG###############################GGGGGGGGG',
];

export const GRID_WIDTH = NEW_MAP_LAYOUT[0].length;
export const GRID_HEIGHT = NEW_MAP_LAYOUT.length;
export const TILE_W = 64;
export const TILE_H = 32;

// Retangulos de piso usados para posicionar rotulos dentro das salas.
export const ROOMS = {
  entrada: { id: 'entrada', nome: 'Entrada', tipo: 'entrada', rect: { x: 24, y: 22, w: 2, h: 2 } },
  recepcao: { id: 'recepcao', nome: 'Recepcao Enrico', tipo: 'recepcao', rect: { x: 13, y: 24, w: 23, h: 4 } },
  sala5: { id: 'sala5', nome: 'Consultorio Bianca', tipo: 'consultorio-grande', rect: { x: 14, y: 1, w: 21, h: 6 } },
  sala1: { id: 'sala1', nome: 'Consultorio Nicolle', tipo: 'consultorio', rect: { x: 1, y: 7, w: 10, h: 4 } },
  sala4: { id: 'sala4', nome: 'Consultorio Ryan', tipo: 'consultorio', rect: { x: 38, y: 7, w: 10, h: 4 } },
  espera: { id: 'espera', nome: 'Salao de Espera', tipo: 'espera', rect: { x: 13, y: 11, w: 23, h: 8 } },
  sala2: { id: 'sala2', nome: 'Consultorio Henrique', tipo: 'consultorio', rect: { x: 1, y: 16, w: 10, h: 7 } },
  sala3: { id: 'sala3', nome: 'Consultorio Felipe', tipo: 'consultorio', rect: { x: 38, y: 16, w: 10, h: 7 } },
};

function sanitizarLinha(linha) {
  const semRotulos = linha.replace(
    /BIANCA|NICOLLE|RYAN|HENRIQUE|FELIPE|ENRICO|CORREDOR\.SUPERIOR|CORREDOR\.INFERIOR|SALÃO\.DE\.ESPERA|RECEPÇÃO/g,
    (rotulo) => '.'.repeat([...rotulo].length),
  );

  return [...semRotulos].map((tile) => (
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

export const POSICAO_INICIAL = { x: 24, y: 22 };

// Posições como fração do tamanho real de mapa_clinica.png (displayWidth × displayHeight).
// cx = mapBg.displayWidth  * frac.x
// cy = mapBg.displayHeight * frac.y
export const NPCS = [
  { id: 'dra_bianca', salaId: 'sala5',   nome: 'Dra. Bianca Cirilo', tema: 'Ácido Hialurônico Avançado',      cor: '#c5a059', spriteKey: 'npc_bianca', frac: { x: 0.35, y: 0.15 } },
  { id: 'enrico',    salaId: 'recepcao', nome: 'Enrico',              tema: 'recepcao',                        cor: '#7fb3d5', spriteKey: 'npc_enrico', frac: { x: 0.42, y: 0.85 } },
  { id: 'nicolle',   salaId: 'sala1',    nome: 'Nicolle',             tema: 'Skincare & Fundamentos',          cor: '#7fb3d5', spriteKey: 'npc_nicolle', frac: { x: 0.18, y: 0.32 } },
  { id: 'henrique',  salaId: 'sala2',    nome: 'Henrique',            tema: 'Toxina Botulínica',               cor: '#82c99a', spriteKey: 'npc_henrique', frac: { x: 0.82, y: 0.32 } },
  { id: 'felipe',    salaId: 'sala3',    nome: 'Felipe',              tema: 'Bioestimuladores de Colágeno',    cor: '#e0a96d', spriteKey: 'npc_felipe', frac: { x: 0.18, y: 0.65 } },
  { id: 'ryan',      salaId: 'sala4',    nome: 'Ryan',                tema: 'Preenchimentos & Riscos Vasculares', cor: '#d98080', spriteKey: 'npc_ryan', frac: { x: 0.82, y: 0.65 } },
];
