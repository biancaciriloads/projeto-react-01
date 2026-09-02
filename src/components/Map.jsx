import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { gameMap, GRID_ROWS, GRID_COLS, doorConnections, npcs } from '../data/mapData';
import { dialogueData } from '../data/dialogueData';
import { quizData } from '../data/quizData';
import './Map.css';

const TILE_SIZE = 32;

/**
 * Map — Renderiza tiles, NPCs e player. (Etapa 2.3)
 *
 * Novidades:
 *  - Detecção de proximidade (raio ≤ 1 tile Manhattan) entre Player e NPCs
 *  - Balão "[E] Conversar" renderizado sobre o NPC próximo
 *  - Tecla 'E' dispara abertura do DialogBox via Zustand
 *  - Movimento bloqueado enquanto diálogo ou quiz estiver ativo
 */
const Map = () => {
  const { player, setPlayerPosition, doors, nearbyNpc, setNearbyNpc,
          activeDialogue, activeQuiz, setActiveDialogue, npcProgress } = useGameStore();

  // ── Detecta NPC mais próximo ────────────────────────────────────────────────
  const detectNearbyNpc = useCallback((px, py) => {
    let closest = null;
    let minDist = Infinity;

    for (const npc of npcs) {
      const dist = Math.abs(npc.x - px) + Math.abs(npc.y - py); // distância de Manhattan
      if (dist <= 1 && dist < minDist) {
        minDist = dist;
        closest = npc;
      }
    }
    setNearbyNpc(closest);
  }, [setNearbyNpc]);

  // ── Abre o DialogBox para o NPC ────────────────────────────────────────────
  const openDialogue = useCallback((npc) => {
    const npcId = npc.id;
    const npcDialogue = dialogueData[npcId];
    if (!npcDialogue) return;

    const progress = npcProgress[npcId];
    const alreadyDone = progress?.completed;

    let phase, lines;

    if (alreadyDone) {
      phase = 'alreadyCompleted';
      lines = npcDialogue.alreadyCompleted || [
        { speaker: npc.name, text: 'Você já completou meu desafio! Continue sua jornada.' },
      ];
    } else {
      // Se o NPC não tem quiz (ex: enrico), vai direto para alreadyCompleted após intro
      const hasQuiz = Boolean(quizData[npcId]);
      phase = 'intro';
      lines = npcDialogue.intro || [{ speaker: npc.name, text: '...' }];
      // Marcar se tem quiz ou não para o DialogBox saber o que fazer após intro
      setActiveDialogue({ npcId, lines, currentLine: 0, phase, finished: false, hasQuiz });
      return;
    }

    setActiveDialogue({ npcId, lines, currentLine: 0, phase, finished: false, hasQuiz: false });
  }, [npcProgress, setActiveDialogue]);

  // ── Handler de teclado ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    // Bloqueia movimento se modal aberto
    const isModalOpen = Boolean(activeDialogue) || Boolean(activeQuiz);

    // Tecla E: interagir com NPC
    if ((e.key === 'e' || e.key === 'E') && nearbyNpc && !isModalOpen) {
      e.preventDefault();
      openDialogue(nearbyNpc);
      return;
    }

    if (isModalOpen) return;

    let { x, y } = player;
    let nextX = x;
    let nextY = y;
    let direction = player.direction;

    switch (e.key) {
      case 'w': case 'W': case 'ArrowUp':    nextY -= 1; direction = 'up';    break;
      case 's': case 'S': case 'ArrowDown':  nextY += 1; direction = 'down';  break;
      case 'a': case 'A': case 'ArrowLeft':  nextX -= 1; direction = 'left';  break;
      case 'd': case 'D': case 'ArrowRight': nextX += 1; direction = 'right'; break;
      default: return;
    }

    if (nextX >= 0 && nextX < GRID_COLS && nextY >= 0 && nextY < GRID_ROWS) {
      const tile = gameMap[nextY][nextX];
      let canMove = false;

      if (tile === 0) {
        canMove = true;
      } else if (tile === 2) {
        const doorId = doorConnections[`${nextX}_${nextY}`];
        if (doors[doorId]) canMove = true;
      }

      if (canMove) {
        setPlayerPosition(nextX, nextY, direction);
        detectNearbyNpc(nextX, nextY);
      } else {
        setPlayerPosition(x, y, direction);
      }
    } else {
      setPlayerPosition(x, y, direction);
    }
  }, [player, setPlayerPosition, doors, nearbyNpc, activeDialogue, activeQuiz, openDialogue, detectNearbyNpc]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Detectar NPCs próximos também na montagem
  useEffect(() => {
    detectNearbyNpc(player.x, player.y);
  }, []); // eslint-disable-line

  // ── Câmera estilo Gather.town ───────────────────────────────────────────────
  const mapTransform = `translate3d(calc(50vw - ${player.x * TILE_SIZE + TILE_SIZE / 2}px), calc(50vh - ${player.y * TILE_SIZE + TILE_SIZE / 2}px), 0)`;

  return (
    <div className="camera-viewport">
      <div
        className="map-container"
        style={{
          width: `${GRID_COLS * TILE_SIZE}px`,
          height: `${GRID_ROWS * TILE_SIZE}px`,
          transform: mapTransform,
        }}
      >
        {/* Renderiza Grid (Matriz de Tiles) */}
        {gameMap.map((row, rowIndex) =>
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
                style={{ left: `${colIndex * TILE_SIZE}px`, top: `${rowIndex * TILE_SIZE}px` }}
              />
            );
          })
        )}

        {/* Renderiza NPCs */}
        {npcs.map((npc) => {
          const isNearby = nearbyNpc?.id === npc.id;
          const isCompleted = Boolean(npcProgress[npc.id]?.completed);

          return (
            <div
              key={npc.id}
              className="npc"
              style={{ left: `${npc.x * TILE_SIZE}px`, top: `${npc.y * TILE_SIZE}px` }}
            >
              {/* Balão de interação */}
              {isNearby && (
                <div className="npc-bubble">
                  <span>[E] Conversar</span>
                </div>
              )}

              {/* Indicador de conclusão */}
              {isCompleted && (
                <div className="npc-completed-badge">✓</div>
              )}

              <div
                className={`npc-sprite ${isNearby ? 'npc-sprite--nearby' : ''} ${isCompleted ? 'npc-sprite--completed' : ''}`}
                title={npc.name}
              />
              <div className="npc-name-tag">{npc.name}</div>
            </div>
          );
        })}

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
