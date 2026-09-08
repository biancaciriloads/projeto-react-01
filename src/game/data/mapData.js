// Definição do mapa da clínica em coordenadas de grid (colunas x linhas).
// O grid é depois projetado visualmente em isometria pelo componente IsometricMap.

export const GRID_WIDTH = 60;
export const GRID_HEIGHT = 40;
export const TILE_W = 64; // largura do losango isométrico
export const TILE_H = 32; // altura do losango isométrico

// Metadados de cada sala/área da clínica.
// rect: {x, y, w, h} em tiles (área INTERNA caminhável).
export const ROOMS = {
  entrada: { id: 'entrada', nome: 'Entrada', tipo: 'entrada', rect: { x: 28, y: 31, w: 4, h: 2 } },
  recepcao: { id: 'recepcao', nome: 'Recepção Enrico', tipo: 'recepcao', rect: { x: 14, y: 32, w: 32, h: 8 } },
  espera: { id: 'espera', nome: 'Salão de Espera', tipo: 'espera', rect: { x: 20, y: 14, w: 20, h: 9 } },
  sala1: { id: 'sala1', nome: 'Consultório Nicolle', tipo: 'consultorio', rect: { x: 3, y: 10, w: 14, h: 9 } },
  sala2: { id: 'sala2', nome: 'Consultório Henrique', tipo: 'consultorio', rect: { x: 3, y: 23, w: 14, h: 9 } },
  sala3: { id: 'sala3', nome: 'Consultório Felipe', tipo: 'consultorio', rect: { x: 43, y: 23, w: 14, h: 9 } },
  sala4: { id: 'sala4', nome: 'Consultório Ryan', tipo: 'consultorio', rect: { x: 43, y: 10, w: 14, h: 9 } },
  sala5: { id: 'sala5', nome: 'Consultório Bianca', tipo: 'consultorio-grande', rect: { x: 20, y: 1, w: 20, h: 7 } },
};

// Planta espelhada: corredores horizontais, conexões centrais e vãos laterais para jardins.
const CORREDORES = [
  { x: 14, y: 10, w: 32, h: 4 },  // corredor superior
  { x: 14, y: 23, w: 32, h: 4 },  // corredor inferior
  { x: 28, y: 7, w: 4, h: 7 },    // porta central da sala da Bianca
  { x: 28, y: 27, w: 4, h: 7 },   // porta central da recepção
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

  Object.values(ROOMS).forEach((sala) => preencherRetangulo(grid, sala.rect, '.'));

  CORREDORES.forEach((c) => preencherRetangulo(grid, c, '.'));

  return grid;
}

export function tileEhCaminhavel(grid, x, y) {
  if (y < 0 || y >= GRID_HEIGHT || x < 0 || x >= GRID_WIDTH) return false;
  const t = grid[y][x];
  return t === '.';
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
export const POSICAO_INICIAL = { x: 30, y: 36 };

// NPCs: um especialista por consultório e Enrico na recepção.
export const NPCS = [
  { id: 'enrico', salaId: 'recepcao', nome: 'Enrico', tema: 'recepcao', cor: '#7fb3d5', spriteKey: 'npc-enrico', pos: centroDaSala(ROOMS.recepcao.rect) },
  { id: 'nicolle', salaId: 'sala1', nome: 'Nicolle', tema: 'Skincare & Fundamentos', cor: '#7fb3d5', pos: centroDaSala(ROOMS.sala1.rect) },
  { id: 'henrique', salaId: 'sala2', nome: 'Henrique', tema: 'Toxina Botulínica', cor: '#82c99a', pos: centroDaSala(ROOMS.sala2.rect) },
  { id: 'felipe', salaId: 'sala3', nome: 'Felipe', tema: 'Bioestimuladores de Colágeno', cor: '#e0a96d', pos: centroDaSala(ROOMS.sala3.rect) },
  { id: 'ryan', salaId: 'sala4', nome: 'Ryan', tema: 'Preenchimentos & Riscos Vasculares', cor: '#d98080', pos: centroDaSala(ROOMS.sala4.rect) },
  { id: 'dra_bianca', salaId: 'sala5', nome: 'Dra. Bianca Cirilo', tema: 'Ácido Hialurônico Avançado', cor: '#c5a059', pos: centroDaSala(ROOMS.sala5.rect) },
];
