// Definição do mapa da clínica em coordenadas de grid (colunas x linhas).
// O grid é depois projetado visualmente em isometria pelo componente IsometricMap.

export const GRID_WIDTH = 60;
export const GRID_HEIGHT = 40;
export const TILE_W = 64; // largura do losango isométrico
export const TILE_H = 32; // altura do losango isométrico

// Metadados de cada sala/área da clínica.
// rect: {x, y, w, h} em tiles (área INTERNA caminhável).
export const ROOMS = {
  entrada: { id: 'entrada', nome: 'Entrada', tipo: 'entrada', rect: { x: 27, y: 38, w: 6, h: 2 } },
  recepcao: { id: 'recepcao', nome: 'Sala de Recepção', tipo: 'recepcao', rect: { x: 20, y: 31, w: 20, h: 8 } },
  saguao: { id: 'saguao', nome: 'Saguão Central', tipo: 'saguao', rect: { x: 26, y: 8, w: 8, h: 24 } },
  sala1: { id: 'sala1', nome: 'Sala do Henrique', tipo: 'consultorio', rect: { x: 3, y: 22, w: 17, h: 7 } },
  sala2: { id: 'sala2', nome: 'Sala da Nicolle', tipo: 'consultorio', rect: { x: 3, y: 5, w: 17, h: 7 } },
  sala3: { id: 'sala3', nome: 'Sala do Felipe', tipo: 'consultorio', rect: { x: 40, y: 22, w: 17, h: 7 } },
  sala4: { id: 'sala4', nome: 'Sala do Ryan', tipo: 'consultorio', rect: { x: 40, y: 5, w: 17, h: 7 } },
  sala5: { id: 'sala5', nome: 'Sala da Bianca', tipo: 'consultorio-grande', rect: { x: 20, y: 1, w: 20, h: 7 } },
};

// Corredores laterais e saguão central, com vãos de parede para futuros jardins internos.
const CORREDORES = [
  { x: 26, y: 8, w: 8, h: 24 },   // saguão central, da Sala da Bianca à recepção
  { x: 20, y: 8, w: 6, h: 5 },    // corredor superior esquerdo
  { x: 34, y: 8, w: 6, h: 5 },    // corredor superior direito
  { x: 20, y: 22, w: 6, h: 7 },   // corredor inferior esquerdo
  { x: 34, y: 22, w: 6, h: 7 },   // corredor inferior direito
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
