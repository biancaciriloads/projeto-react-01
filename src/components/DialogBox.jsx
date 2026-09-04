import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { quizData } from '../data/quizData';
import './DialogBox.css';

/**
 * DialogBox — Caixa de diálogo estilo RPG GBA (Etapa 2.3)
 *
 * Layout: portrait do NPC (esquerda) | texto centralizado | portrait do Player (direita)
 *
 * Fluxo:
 *  1. Exibe as linhas da fase 'intro' uma a uma
 *  2. Ao terminar 'intro' E o NPC tiver quiz → abre QuizModal
 *  3. Ao terminar 'intro' SEM quiz (ex: Enrico) → fecha
 *  4. Fases 'success', 'fail', 'alreadyCompleted' apenas exibem texto e fecham
 *
 * Controles: E | Espaço | clique no botão "Avançar"
 */

// Mapeamento de portrait por npcId
const PORTRAITS = {
  enrico:     '/assets/portraits/RecepcionistaEnricoPerfil.png',
  nicolle:    '/assets/portraits/EspecialistaNicollePerfil.png',
  henrique:   '/assets/portraits/EspecialistaHenriquePerfil.png',
  felipe:     '/assets/portraits/EspecialistaFelipePerfil.png',
  ryan:       '/assets/portraits/EspecialistaRyanPerfil.png',
  dra_bianca: '/assets/portraits/Dra.BiancaPerfil.png',
};

const PLAYER_PORTRAIT = '/assets/portraits/PlayerPerfil.png';

export default function DialogBox() {
  const activeDialogue  = useGameStore((s) => s.activeDialogue);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);
  const clearDialogue   = useGameStore((s) => s.clearDialogue);
  const setActiveQuiz   = useGameStore((s) => s.setActiveQuiz);

  // ── Ao terminar as linhas, decide o próximo passo ──────────────────────────
  useEffect(() => {
    if (!activeDialogue?.finished) return;

    const { npcId, phase, hasQuiz } = activeDialogue;
    clearDialogue();

    if (phase === 'intro' && hasQuiz) {
      // Abre o QuizModal com as questões do NPC
      const quizId = npcId === 'dra_bianca' ? 'bianca' : npcId;
      const npcQuiz = quizData[quizId];
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
    }
    // Fases success/fail/alreadyCompleted/intro sem quiz → só fecha
  }, [activeDialogue?.finished]);

  // ── Avança para próxima linha ──────────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (!activeDialogue || activeDialogue.finished) return;
    advanceDialogue();
  }, [activeDialogue, advanceDialogue]);

  // ── Listener de teclado ────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeDialogue) return;
    const onKey = (e) => {
      if (['e', 'E', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        handleAdvance();
      }
      if (e.key === 'Escape') clearDialogue();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDialogue, handleAdvance, clearDialogue]);

  if (!activeDialogue || activeDialogue.finished) return null;

  const { npcId, lines, currentLine } = activeDialogue;
  const line        = lines[currentLine];
  const isLastLine  = currentLine >= lines.length - 1;
  const npcPortrait = PORTRAITS[npcId] || null;

  // Iniciais para avatar fallback
  const initials = (line?.speaker || npcId)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      <motion.div
        className="dialogbox-overlay"
        key="dialogbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="dialogbox"
          key="dialogbox"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        >
          {/* ── Portrait NPC (esquerda) ── */}
          <div className="dialogbox-portrait dialogbox-portrait--npc">
            {npcPortrait ? (
              <img
                src={npcPortrait}
                alt={line?.speaker}
                className="dialogbox-portrait-img"
              />
            ) : (
              <div className="dialogbox-portrait-fallback">{initials}</div>
            )}
            <span className="dialogbox-portrait-label">{line?.speaker}</span>
          </div>

          {/* ── Área de texto central ── */}
          <div className="dialogbox-body">
            {/* Indicador de quem fala */}
            <div className="dialogbox-speaker">{line?.speaker}</div>

            {/* Texto animado ao mudar de linha */}
            <motion.div
              key={`line-${currentLine}`}
              className="dialogbox-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              {line?.text}
            </motion.div>

            {/* Rodapé */}
            <div className="dialogbox-footer">
              <span className="dialogbox-progress">
                {currentLine + 1} / {lines.length}
              </span>
              <button
                className="dialogbox-btn"
                onClick={handleAdvance}
              >
                {isLastLine ? 'Continuar ▶' : 'Avançar ▶'}
              </button>
              <span className="dialogbox-hint">[E] ou [Espaço]</span>
            </div>
          </div>

          {/* ── Portrait Player (direita) ── */}
          <div className="dialogbox-portrait dialogbox-portrait--player">
            <img
              src={PLAYER_PORTRAIT}
              alt="Player"
              className="dialogbox-portrait-img"
            />
            <span className="dialogbox-portrait-label">Você</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
