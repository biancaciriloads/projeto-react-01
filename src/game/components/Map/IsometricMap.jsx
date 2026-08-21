import React, { useMemo } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, gerarGrid, gridParaIso, TILE_W, TILE_H, ROOMS } from '../../data/mapData';

// Paleta de cor por tipo de sala, para diferenciar visualmente os ambientes
// sem depender de nenhum asset externo — tudo é CSS puro.
const COR_POR_TIPO = {
  entrada: '#d9c7a3',
  recepcao: '#e8d9b5',
  loja: '#dcd0f0',
  espera: '#d7e4d0',
  consultorio: '#cfe3ee',
  'consultorio-grande': '#f0d9c9',
};

function tipoDaSalaNoTile(x, y) {
  for (const sala of Object.values(ROOMS)) {
    const { rect } = sala;
    if (x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h) {
      return sala.tipo === 'loja' ? 'loja' : sala.tipo;
    }
  }
  return null;
}

function Tile({ x, y, tipo }) {
  const { left, top } = gridParaIso(x, y);
  const cor = COR_POR_TIPO[tipo] || '#e5ded0';
  return (
    <div
      className="iso-tile"
      style={{
        left,
        top,
        width: TILE_W,
        height: TILE_H,
        background: cor,
      }}
    />
  );
}

export default function IsometricMap({ children }) {
  const grid = useMemo(() => gerarGrid(), []);

  const tiles = useMemo(() => {
    const arr = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const t = grid[y][x];
        if (t === '.' || t === 'L') {
          arr.push({ x, y, tipo: tipoDaSalaNoTile(x, y) });
        }
      }
    }
    return arr;
  }, [grid]);

  // Centraliza o mapa: deslocamento para que o tile (0,0) não fique fora da tela.
  const offsetX = (GRID_HEIGHT * TILE_W) / 2;

  return (
    <div className="iso-map-viewport">
      <div className="iso-map-world" style={{ transform: `translate(${offsetX}px, 20px)` }}>
        {tiles.map((t) => (
          <Tile key={`${t.x}-${t.y}`} x={t.x} y={t.y} tipo={t.tipo} />
        ))}

        {/* Placa e porta de entrada */}
        <div
          className="clinica-placa"
          style={{ ...gridParaIso(ROOMS.entrada.rect.x + 3, ROOMS.entrada.rect.y - 1) }}
        >
          Clínica Estética Master
        </div>

        {/* Rótulos das salas */}
        {Object.values(ROOMS).map((sala) => {
          const centro = { x: sala.rect.x + sala.rect.w / 2, y: sala.rect.y };
          const pos = gridParaIso(centro.x, centro.y - 0.6);
          return (
            <div key={sala.id} className="sala-label" style={pos}>
              {sala.nome}
            </div>
          );
        })}

        {children}
      </div>
    </div>
  );
}
