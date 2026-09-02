import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { dialogueData } from '../data/dialogueData';
import './QuizModal.css';

/**
 * QuizModal — Modal de Quiz Interativo (Etapa 2.3)
 *
 * Fluxo por questão:
 *  1. Renderiza pergunta + 4 opções
 *  2. Jogador clica ou pressiona 1–4
 *  3. Feedback animado (✅ ou ❌ + resposta correta)
 *  4. ENTER / clique em "Próxima" avança
 *  5. Ao terminar → tela de resultado (aprovado ≥ 70% | reprovado)
 *  6. Aprovado → unlockDoor() + diálogo 'success'
 *     Reprovado → diálogo 'fail' (sem desbloquear)
 *
 * Animações: framer-motion (entrada do modal, transição de questão, feedback)
 */

// Mapeamento NPC → porta que será desbloqueada ao passar no quiz
const NPC_DOOR_MAP = {
  nicolle:    'door_room1',
  henrique:   'door_room2',
  felipe:     'door_room3',
  ryan:       'door_room4',
  dra_bianca: 'door_room5',
};

const PORTRAITS = {
  enrico:     '/assets/portraits/RecepcionistaEnricoPerfil.png',
  nicolle:    '/assets/portraits/EspecialistaNicollePerfil.png',
  henrique:   null,
  felipe:     '/assets/portraits/EspecialistaFelipePerfil.png',
  ryan:       '/assets/portraits/EspecialistaRyanPerfil.png',
  dra_bianca: '/assets/portraits/Dra.BiancaPerfil.png',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// Variantes de animação framer-motion
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.88, opacity: 0, y: 30 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26 },
  },
  exit: {
    scale: 0.88,
    opacity: 0,
    y: 30,
    transition: { duration: 0.2 },
  },
};

const questionVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.18 } },
};

const feedbackVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 380, damping: 22 },
  },
};

const resultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
};

export default function QuizModal() {
  const activeQuiz       = useGameStore((s) => s.activeQuiz);
  const answerQuestion   = useGameStore((s) => s.answerQuestion);
  const dismissFeedback  = useGameStore((s) => s.dismissFeedback);
  const clearQuiz        = useGameStore((s) => s.clearQuiz);
  const setActiveDialogue = useGameStore((s) => s.setActiveDialogue);
  const markNpcCompleted = useGameStore((s) => s.markNpcCompleted);
  const unlockDoor       = useGameStore((s) => s.unlockDoor);

  // Controla a tela de resultado final (após todas as questões)
  const [showResult, setShowResult] = useState(false);

  // Reset ao abrir novo quiz — depende intencionalmente apenas do npcId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeQuiz && !activeQuiz.finished) setShowResult(false);
  }, [activeQuiz?.npcId]);

  // Quando quiz termina, espera dismissFeedback da última questão e então mostra resultado
  useEffect(() => {
    if (!activeQuiz?.finished || activeQuiz?.showingFeedback) return;
    setShowResult(true);
  }, [activeQuiz?.finished, activeQuiz?.showingFeedback]);

  // ── Seleção de resposta ────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (index) => {
      if (!activeQuiz || activeQuiz.showingFeedback || activeQuiz.finished) return;
      answerQuestion(index);
    },
    [activeQuiz, answerQuestion]
  );

  // ── Avança após feedback ───────────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    if (!activeQuiz?.showingFeedback) return;
    dismissFeedback();
  }, [activeQuiz, dismissFeedback]);

  // ── Fecha o quiz e abre diálogo de resultado ───────────────────────────────
  const handleFinish = useCallback(
    (passed) => {
      const { npcId, score, questions } = activeQuiz;
      const total = questions.length;
      const npcData = dialogueData[npcId];

      if (passed) {
        markNpcCompleted(npcId, score, total);
        const doorKey = NPC_DOOR_MAP[npcId];
        if (doorKey) unlockDoor(doorKey);
      }

      const phase = passed ? 'success' : 'fail';
      const lines = npcData?.[phase] || [
        {
          speaker: npcId,
          text: passed
            ? 'Parabéns! Você passou no quiz!'
            : 'Não foi dessa vez. Tente novamente!',
        },
      ];

      clearQuiz();
      setShowResult(false);
      setActiveDialogue({
        npcId,
        lines,
        currentLine: 0,
        phase,
        finished: false,
        hasQuiz: false,
        score,
        total,
      });
    },
    [activeQuiz, markNpcCompleted, unlockDoor, clearQuiz, setActiveDialogue]
  );

  // ── Reiniciar tentativa (em caso de reprovação) ───────────────────────────
  const handleRetry = useCallback(() => {
    if (!activeQuiz) return;
    const { npcId, questions } = activeQuiz;
    clearQuiz();
    setShowResult(false);
    // Reabre o quiz do zero
    setTimeout(() => {
      useGameStore.getState().setActiveQuiz({
        npcId,
        questions,
        currentQuestion: 0,
        score: 0,
        answers: [],
        finished: false,
        showingFeedback: false,
        lastAnswerCorrect: null,
      });
    }, 50);
  }, [activeQuiz, clearQuiz]);

  // ── Listener de teclado ───────────────────────────────────────────────────
  useEffect(() => {
    if (!activeQuiz) return;
    const onKey = (e) => {
      if (showResult) {
        // Teclas de ação na tela de resultado são tratadas pelos botões
        return;
      }
      if (activeQuiz.showingFeedback) {
        if (['Enter', ' ', 'e', 'E'].includes(e.key)) {
          e.preventDefault();
          handleDismiss();
        }
        return;
      }
      const numMap = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
      if (numMap[e.key] !== undefined) {
        e.preventDefault();
        handleSelect(numMap[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeQuiz, showResult, handleDismiss, handleSelect]);

  if (!activeQuiz) return null;

  const {
    npcId,
    questions,
    currentQuestion,
    score,
    showingFeedback,
    lastAnswerCorrect,
    finished,
  } = activeQuiz;

  const total      = questions.length;
  const portrait   = PORTRAITS[npcId] || null;
  const npcData    = dialogueData[npcId];
  const npcName    = npcData?.intro?.[0]?.speaker || npcId;

  // Índice da questão sendo exibida (durante feedback, volta para a última respondida)
  const displayIndex = showingFeedback || finished
    ? Math.max(0, currentQuestion - 1)
    : currentQuestion;
  const currentQ = questions[displayIndex];

  const progressPct = (displayIndex / total) * 100;

  // Resultado final
  const finalScore  = score;
  const passRate    = finalScore / total;
  const passed      = passRate >= 0.7;

  return (
    <AnimatePresence>
      <motion.div
        className="quiz-overlay"
        key="quiz-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="quiz-modal"
          key="quiz-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── HEADER ── */}
          <div className="quiz-header">
            <div className="quiz-header-npc">
              {portrait ? (
                <img src={portrait} alt={npcName} className="quiz-header-portrait" />
              ) : (
                <div className="quiz-header-portrait-fallback">
                  {npcId?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="quiz-header-name">{npcName}</div>
                <div className="quiz-header-sub">Quiz de Conhecimento</div>
              </div>
            </div>

            <div className="quiz-header-score">
              <span className="quiz-score-num">{score}</span>
              <span className="quiz-score-sep">/</span>
              <span className="quiz-score-den">{displayIndex}</span>
            </div>
          </div>

          {/* ── BARRA DE PROGRESSO ── */}
          <div className="quiz-progressbar">
            <motion.div
              className="quiz-progressbar-fill"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <span className="quiz-progressbar-label">
              {displayIndex + 1} / {total}
            </span>
          </div>

          {/* ══════════════════════════════════════════════
              ESTADO 1 — Pergunta + Opções
              ══════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {!showingFeedback && !showResult && currentQ && (
              <motion.div
                key={`question-${displayIndex}`}
                className="quiz-body"
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <p className="quiz-question">{currentQ.question}</p>

                <div className="quiz-options">
                  {currentQ.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      className="quiz-option-btn"
                      onClick={() => handleSelect(idx)}
                      whileHover={{ x: 5, backgroundColor: 'rgba(92,107,192,0.18)' }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="quiz-option-label">{OPTION_LABELS[idx]}</span>
                      <span className="quiz-option-text">{opt}</span>
                    </motion.button>
                  ))}
                </div>

                <p className="quiz-keyboard-hint">
                  Teclas A–D ou 1–4 para selecionar
                </p>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                ESTADO 2 — Feedback pós-resposta
                ══════════════════════════════════════════════ */}
            {showingFeedback && currentQ && !showResult && (
              <motion.div
                key="feedback"
                className={`quiz-feedback ${lastAnswerCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}
                variants={feedbackVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="quiz-feedback-icon">
                  {lastAnswerCorrect ? '✅' : '❌'}
                </div>
                <div className="quiz-feedback-title">
                  {lastAnswerCorrect ? 'Correto!' : 'Incorreto!'}
                </div>
                {!lastAnswerCorrect && (
                  <div className="quiz-feedback-correct-answer">
                    <strong>Resposta correta:</strong>
                    <br />
                    {currentQ.options[currentQ.correctAnswer]}
                  </div>
                )}
                <motion.button
                  className="quiz-btn quiz-btn--primary"
                  onClick={handleDismiss}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {currentQuestion >= total ? 'Ver Resultado →' : 'Próxima Questão →'}
                </motion.button>
                <p className="quiz-keyboard-hint">[ENTER] para continuar</p>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                ESTADO 3 — Resultado Final
                ══════════════════════════════════════════════ */}
            {showResult && (
              <motion.div
                key="result"
                className={`quiz-result ${passed ? 'quiz-result--pass' : 'quiz-result--fail'}`}
                variants={resultVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="quiz-result-emoji">{passed ? '🏆' : '📚'}</div>
                <div className="quiz-result-title">
                  {passed ? 'Aprovado(a)!' : 'Reprovado(a)'}
                </div>
                <div className="quiz-result-score">
                  <span className="quiz-result-score-num">{finalScore}</span>
                  <span className="quiz-result-score-sep"> / </span>
                  <span className="quiz-result-score-den">{total}</span>
                  <span className="quiz-result-score-pct">
                    ({Math.round(passRate * 100)}%)
                  </span>
                </div>
                <div className="quiz-result-msg">
                  {passed
                    ? 'Excelente! A porta da próxima sala foi desbloqueada.'
                    : `Você precisava de ${Math.ceil(total * 0.7)} acertos (70%). Tente novamente!`}
                </div>

                <div className="quiz-result-actions">
                  {passed ? (
                    <motion.button
                      className="quiz-btn quiz-btn--success"
                      onClick={() => handleFinish(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Continuar →
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        className="quiz-btn quiz-btn--danger"
                        onClick={handleRetry}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        🔄 Tentar Novamente
                      </motion.button>
                      <motion.button
                        className="quiz-btn quiz-btn--secondary"
                        onClick={() => handleFinish(false)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Sair
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
