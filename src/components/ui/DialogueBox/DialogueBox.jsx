import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { quizData } from '../../../data/quizData';
import { dialogueData } from '../../../data/dialogueData';
import './DialogueBox.css';

/**
 * DialogueBox
 *
 * Caixa de diálogo estilo RPG clássico.
 * Exibe as falas do NPC linha a linha.
 * Ao terminar a fase 'intro', abre automaticamente o Quiz Modal.
 * Ao terminar fases 'success' / 'fail' / 'alreadyCompleted', fecha.
 *
 * Controles: ENTER / SPACE / X para avançar
 */
export default function DialogueBox() {
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);
  const clearDialogue = useGameStore((s) => s.clearDialogue);
  const setActiveQuiz = useGameStore((s) => s.setActiveQuiz);
  const markNpcCompleted = useGameStore((s) => s.markNpcCompleted);
  const unlockDoor = useGameStore((s) => s.unlockDoor);
  const setGameCompleted = useGameStore((s) => s.setGameCompleted);

  // Mapeamento NPC → porta que ele desbloqueia
  const npcDoorMap = {
    nicolle: 'door_room2',  // Nicolle desbloqueia acesso às Salas 3 e 4
    henrique: 'door_room1', // Henrique desbloqueia acesso às Salas 3 e 4
    felipe: 'door_room3',
    ryan: 'door_room4',
    dra_bianca: 'door_room5', // Sala premium - desbloqueia certificado
  };

  // Quando um diálogo é marcado como 'finished', decide o que fazer a seguir
  useEffect(() => {
    if (!activeDialogue?.finished) return;

    const { npcId, phase, score, total } = activeDialogue;

    clearDialogue();

    if (phase === 'intro') {
      // Abre o quiz após a introdução
      const npcQuiz = quizData[npcId];
      if (npcQuiz) {
        setActiveQuiz({
          npcId,
          questions: npcQuiz.questions,
          currentQuestion: 0,
          score: 0,
          answers: [],
          finished: false,
          showingFeedback: false,
          lastAnswerCorrect: null,
        });
      }
    } else if (phase === 'success') {
      // Desbloqueia porta associada ao NPC
      const doorKey = npcDoorMap[npcId];
      if (doorKey) unlockDoor(doorKey);

      // Se for a Dra. Bianca, finaliza o jogo
      if (npcId === 'dra_bianca') {
        setGameCompleted({ npcId, score, total, completedAt: new Date().toISOString() });
      }
    }
    // 'fail' e 'alreadyCompleted' apenas fecham
  }, [activeDialogue?.finished]);

  const handleAdvance = useCallback(() => {
    if (!activeDialogue || activeDialogue.finished) return;
    advanceDialogue();
  }, [activeDialogue, advanceDialogue]);

  // Listener de teclado (ENTER, SPACE, X, Z)
  useEffect(() => {
    if (!activeDialogue) return;
    const onKey = (e) => {
      if (['Enter', ' ', 'x', 'X', 'z', 'Z'].includes(e.key)) {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'Escape') {
        clearDialogue();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDialogue, handleAdvance, clearDialogue]);

  if (!activeDialogue || activeDialogue.finished) return null;

  const { npcId, lines, currentLine } = activeDialogue;
  const currentLineData = lines[currentLine];
  const npcData = dialogueData[npcId];
  const portrait = npcData?.portrait || null;
  const isLastLine = currentLine >= lines.length - 1;

  // Iniciais para fallback de avatar
  const initials = currentLineData?.speaker
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="dialogue-overlay" onClick={handleAdvance}>
      <div className="dialogue-box" onClick={(e) => e.stopPropagation()}>
        {/* Retrato do NPC */}
        <div className="dialogue-portrait-wrap">
          {portrait ? (
            <img
              src={portrait}
              alt={currentLineData?.speaker}
              className="dialogue-portrait"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div
            className="dialogue-portrait-fallback"
            style={{ display: portrait ? 'none' : 'flex' }}
          >
            {initials}
          </div>
        </div>

        {/* Conteúdo textual */}
        <div className="dialogue-content">
          <div className="dialogue-speaker">{currentLineData?.speaker}</div>
          <div className="dialogue-text">{currentLineData?.text}</div>

          {/* Indicador de progresso das falas */}
          <div className="dialogue-footer">
            <span className="dialogue-progress">
              {currentLine + 1}/{lines.length}
            </span>
            <span className="dialogue-hint">
              {isLastLine ? '[ ENTER ] Continuar' : '[ ENTER ] Próxima fala'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
