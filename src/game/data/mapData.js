// Definição do mapa da clínica em coordenadas de grid (colunas x linhas).
// O grid é depois projetado visualmente em isometria pelo componente IsometricMap.

export const GRID_WIDTH = 22;
export const GRID_HEIGHT = 20;
export const TILE_W = 64; // largura do losango isométrico
export const TILE_H = 32; // altura do losango isométrico

// Metadados de cada sala/área da clínica.
// rect: {x, y, w, h} em tiles (área INTERNA caminhável).
export const ROOMS = {
  entrada: { id: 'entrada', nome: 'Entrada', tipo: 'entrada', rect: { x: 8, y: 17, w: 6, h: 2 } },
  recepcao: { id: 'recepcao', nome: 'Recepção', tipo: 'recepcao', rect: { x: 6, y: 13, w: 10, h: 3 } },
  loja: { id: 'loja', nome: 'Loja', tipo: 'loja', rect: { x: 17, y: 12, w: 4, h: 5 } },
  espera: { id: 'espera', nome: 'Sala de Espera', tipo: 'espera', rect: { x: 6, y: 9, w: 10, h: 3 } },
  sala1: { id: 'sala1', nome: 'Consultório 1', tipo: 'consultorio', rect: { x: 1, y: 5, w: 4, h: 3 } },
  sala2: { id: 'sala2', nome: 'Consultório 2', tipo: 'consultorio', rect: { x: 1, y: 1, w: 4, h: 3 } },
  sala3: { id: 'sala3', nome: 'Consultório 3', tipo: 'consultorio', rect: { x: 17, y: 5, w: 4, h: 3 } },
  sala4: { id: 'sala4', nome: 'Consultório 4', tipo: 'consultorio', rect: { x: 17, y: 1, w: 4, h: 3 } },
  sala5: { id: 'sala5', nome: 'Consultório 5 — Sala Master', tipo: 'consultorio-grande', rect: { x: 6, y: 1, w: 10, h: 3 } },
};

// Corredores que conectam as salas (garantem que o grid seja totalmente navegável).
const CORREDORES = [
  { x: 9, y: 1, w: 4, h: 17 },  // corredor central vertical
  { x: 1, y: 2, w: 20, h: 1 },  // corredor horizontal superior (liga salas 2/4 à sala 5)
  { x: 1, y: 6, w: 20, h: 1 },  // corredor horizontal do meio (liga salas 1/3)
  { x: 9, y: 13, w: 9, h: 1 },  // corredor da recepção até a loja
];

function criarGridVazio() {
  const grid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid.push(new Array(GRID_WIDTH).fill('#'));
  }
  return grid;
}

function preencherRetangulo(grid, rect, tipo) {
  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
        grid[y][x] = tipo;
      }
    }
  }
}

export function gerarGrid() {
  const grid = criarGridVazio();

  Object.values(ROOMS).forEach((sala) => {
    const tipoTile = sala.tipo === 'loja' ? 'L' : '.';
    preencherRetangulo(grid, sala.rect, tipoTile);
  });

  CORREDORES.forEach((c) => preencherRetangulo(grid, c, '.'));

  return grid;
}

export function tileEhCaminhavel(grid, x, y) {
  if (y < 0 || y >= GRID_HEIGHT || x < 0 || x >= GRID_WIDTH) return false;
  const t = grid[y][x];
  return t === '.' || t === 'L';
}

// Posição central de uma sala (em tiles), útil para posicionar NPCs/objetos.
export function centroDaSala(rect) {
  return {
    x: Math.floor(rect.x + rect.w / 2),
    y: Math.floor(rect.y + rect.h / 2),
  };
}

// Converte coordenada de grid (x,y) em posição de tela isométrica (px).
export function gridParaIso(x, y) {
  return {
    left: (x - y) * (TILE_W / 2),
    top: (x + y) * (TILE_H / 2),
  };
}

// Posição inicial do jogador (na entrada da clínica).
export const POSICAO_INICIAL = { x: 10, y: 18 };

// NPCs: um especialista por consultório + o vendedor da loja.
export const NPCS = [
  { id: 'enrico', salaId: 'recepcao', nome: 'Enrico', tema: 'recepcao', cor: '#7fb3d5', spriteKey: 'npc-enrico', pos: centroDaSala(ROOMS.recepcao.rect) },
  { id: 'nicolle', salaId: 'sala1', nome: 'Nicolle', tema: 'Skincare & Fundamentos', cor: '#7fb3d5', pos: centroDaSala(ROOMS.sala1.rect) },
  { id: 'henrique', salaId: 'sala2', nome: 'Henrique', tema: 'Toxina Botulínica', cor: '#82c99a', pos: centroDaSala(ROOMS.sala2.rect) },
  { id: 'felipe', salaId: 'sala3', nome: 'Felipe', tema: 'Bioestimuladores de Colágeno', cor: '#e0a96d', pos: centroDaSala(ROOMS.sala3.rect) },
  { id: 'ryan', salaId: 'sala4', nome: 'Ryan', tema: 'Preenchimentos & Riscos Vasculares', cor: '#d98080', pos: centroDaSala(ROOMS.sala4.rect) },
  { id: 'dra_bianca', salaId: 'sala5', nome: 'Dra. Bianca Cirilo', tema: 'Ácido Hialurônico Avançado', cor: '#c5a059', pos: centroDaSala(ROOMS.sala5.rect) },
];
