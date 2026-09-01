import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { gameMap, GRID_ROWS, GRID_COLS, doorConnections, npcs } from '../data/mapData';
import './Map.css';

const TILE_SIZE = 32;

const Map = () => {
  const { player, setPlayerPosition, doors } = useGameStore();

  const handleKeyDown = useCallback((e) => {
    let { x, y } = player;
    let nextX = x;
    let nextY = y;
    let direction = player.direction;

    switch (e.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        nextY -= 1;
        direction = 'up';
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        nextY += 1;
        direction = 'down';
        break;
      case 'a':
      case 'A':
      case 'ArrowLeft':
        nextX -= 1;
        direction = 'left';
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        nextX += 1;
        direction = 'right';
        break;
      default:
        return;
    }

    // Validação de limites
    if (nextX >= 0 && nextX < GRID_COLS && nextY >= 0 && nextY < GRID_ROWS) {
      const tile = gameMap[nextY][nextX];
      
      let canMove = false;
      if (tile === 0) { // Chão
        canMove = true;
      } else if (tile === 2) { // Porta
        const doorId = doorConnections[`${nextX}_${nextY}`];
        if (doors[doorId]) {
          canMove = true; // Se porta destrancada
        }
      }

      if (canMove) {
        setPlayerPosition(nextX, nextY, direction);
      } else {
        // Bloqueado na parede/porta trancada, apenas vira a direção
        setPlayerPosition(x, y, direction);
      }
    } else {
      setPlayerPosition(x, y, direction);
    }
  }, [player, setPlayerPosition, doors]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Câmera estilo Gather.town via translate3d centrado no jogador
  const mapTransform = `translate3d(calc(50vw - ${player.x * TILE_SIZE + TILE_SIZE / 2}px), calc(50vh - ${player.y * TILE_SIZE + TILE_SIZE / 2}px), 0)`;

  return (
    <div className="camera-viewport">
      <div 
        className="map-container"
        style={{
          width: `${GRID_COLS * TILE_SIZE}px`,
          height: `${GRID_ROWS * TILE_SIZE}px`,
          transform: mapTransform
        }}
      >
        {/* Renderiza Grid (Matriz) */}
        {gameMap.map((row, rowIndex) => (
          row.map((tile, colIndex) => {
            let tileClass = 'tile-floor';
            if (tile === 1) tileClass = 'tile-wall';
            else if (tile === 2) {
              const doorId = doorConnections[`${colIndex}_${rowIndex}`];
              tileClass = doors[doorId] ? 'tile-door-open' : 'tile-door-closed';
            }
            return (
              <div 
                key={`tile-${colIndex}-${rowIndex}`} 
                className={`tile ${tileClass}`}
                style={{
                  left: `${colIndex * TILE_SIZE}px`,
                  top: `${rowIndex * TILE_SIZE}px`,
                }}
              />
            );
          })
        ))}

        {/* Renderiza NPCs */}
        {npcs.map((npc) => (
          <div 
            key={npc.id}
            className="npc"
            style={{
              left: `${npc.x * TILE_SIZE}px`,
              top: `${npc.y * TILE_SIZE}px`,
            }}
          >
            <div className="npc-sprite" title={npc.name} />
          </div>
        ))}

        {/* Renderiza Player */}
        <div 
          className="player"
          style={{
            left: `${player.x * TILE_SIZE}px`,
            top: `${player.y * TILE_SIZE}px`,
          }}
        >
          <div className={`player-sprite dir-${player.direction}`} />
        </div>
      </div>
    </div>
  );
};

export default Map;
