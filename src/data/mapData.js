// 0: Chão transitável
// 1: Parede / Obstáculo (Colisão)
// 2: Porta / Catraca (Bloqueada/Desbloqueada)

export const GRID_ROWS = 42;
export const GRID_COLS = 30;

// Função geradora para facilitar a construção das paredes da clínica
const generateMap = () => {
  const map = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
  
  // Função auxiliar para desenhar as paredes de uma sala
  const drawBox = (x1, y1, x2, y2) => {
    for(let y=y1; y<=y2; y++) {
      for(let x=x1; x<=x2; x++) {
        if(x===x1 || x===x2 || y===y1 || y===y2) map[y][x] = 1;
      }
    }
  };

  // Borda externa geral do mapa
  drawBox(0, 0, GRID_COLS-1, GRID_ROWS-1);

  // Sala 5 Premium (Meio superior) Y: 0 a 9 / X: 8 a 21
  drawBox(8, 0, 21, 9);
  map[9][14] = 2; map[9][15] = 2; // portas duplas (acesso ao corredor)

  // Sala 3 (Esquerda) Y: 10 a 19 / X: 0 a 12
  drawBox(0, 10, 12, 19);
  map[14][12] = 2; // porta da sala 3

  // Sala 4 (Direita) Y: 10 a 19 / X: 17 a 29
  drawBox(17, 10, 29, 19);
  map[14][17] = 2; // porta da sala 4

  // Sala 1 (Esquerda) Y: 20 a 29 / X: 0 a 12
  drawBox(0, 20, 12, 29);
  map[24][12] = 2; // porta da sala 1

  // Sala 2 (Direita) Y: 20 a 29 / X: 17 a 29
  drawBox(17, 20, 29, 29);
  map[24][17] = 2; // porta da sala 2

  // Recepção (Ocupa o terço inferior inteiro) Y: 30 a 41
  drawBox(0, 30, 29, 41);
  map[30][14] = 2; map[30][15] = 2; // porta dupla de acesso da recepção aos corredores

  return map;
};

// Matriz final gerada
export const gameMap = generateMap();

export const rooms = {
  reception: { id: 'reception', name: 'Recepção', bounds: { startX: 1, endX: 28, startY: 31, endY: 40 } },
  room1: { id: 'room1', name: 'Sala 1 (Limpeza de Pele)', bounds: { startX: 1, endX: 11, startY: 21, endY: 28 } },
  room2: { id: 'room2', name: 'Sala 2 (Botox & Preenchimento)', bounds: { startX: 18, endX: 28, startY: 21, endY: 28 } },
  room3: { id: 'room3', name: 'Sala 3 (Bioestimuladores)', bounds: { startX: 1, endX: 11, startY: 11, endY: 18 } },
  room4: { id: 'room4', name: 'Sala 4 (Tecnologias Estéticas)', bounds: { startX: 18, endX: 28, startY: 11, endY: 18 } },
  room5: { id: 'room5', name: 'Sala 5 (Sala Premium)', bounds: { startX: 9, endX: 20, startY: 1, endY: 8 } }
};

export const npcs = [
  { id: 'enrico', name: 'Enrico', role: 'Recepcionista', room: 'reception', x: 15, y: 35 },
  { id: 'nicolle', name: 'Nicolle', role: 'Especialista em Limpeza de Pele', room: 'room1', x: 6, y: 24 },
  { id: 'henrique', name: 'Henrique', role: 'Especialista em Botox', room: 'room2', x: 23, y: 24 },
  { id: 'felipe', name: 'Felipe', role: 'Especialista em Bioestimuladores', room: 'room3', x: 6, y: 14 },
  { id: 'ryan', name: 'Ryan', role: 'Especialista em Tecnologias', room: 'room4', x: 23, y: 14 },
  { id: 'dra_bianca', name: 'Dra. Bianca Cirilo', role: 'Médica Chefe', room: 'room5', x: 15, y: 4 }
];

// Mapeamento das coordenadas das portas (X_Y) com os IDs do estado na useGameStore.js
export const doorConnections = {
  '14_30': 'door_corridor',
  '15_30': 'door_corridor',
  '12_24': 'door_room1',
  '17_24': 'door_room2',
  '12_14': 'door_room3',
  '17_14': 'door_room4',
  '14_9': 'door_room5',
  '15_9': 'door_room5'
};
