import React, { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { dialogueData } from '../../../data/dialogueData';
import './QuizModal.css';

/**
 * QuizModal
 *
 * Modal de quiz multi-step.
 * Fluxo por questão:
 *   1. Exibe a pergunta e 4 alternativas
 *   2. Jogador seleciona uma opção
 *   3. Mostra feedback (✅ Correto / ❌ Errado + explicação visual)
 *   4. Após ENTER ou clique em "Próxima", avança
 *   5. Ao terminar todas as questões, exibe placar final
 *   6. Define diálogo de 'success' ou 'fail' conforme resultado
 *
 * Critério de aprovação: ≥ 70% de acertos
 */
export default function QuizModal() {
  const activeQuiz = useGameStore((s) => s.activeQuiz);
  const answerQuestion = useGameStore((s) => s.answerQuestion);
  const dismissFeedback = useGameStore((s) => s.dismissFeedback);
  const clearQuiz = useGameStore((s) => s.clearQuiz);
  const setActiveDialogue = useGameStore((s) => s.setActiveDialogue);
  const markNpcCompleted = useGameStore((s) => s.markNpcCompleted);
  const npcProgress = useGameStore((s) => s.npcProgress);

  const [selectedOption, setSelectedOption] = useState(null);

  // Reset seleção ao avançar de questão
  useEffect(() => {
    if (activeQuiz && !activeQuiz.showingFeedback) {
      setSelectedOption(null);
    }
  }, [activeQuiz?.currentQuestion, activeQuiz?.showingFeedback]);

  // Ao terminar o quiz, abre o diálogo de resultado
  useEffect(() => {
    if (!activeQuiz?.finished) return;

    const { npcId, score, questions } = activeQuiz;
    const total = questions.length;
    const passRate = score / total;
    const passed = passRate >= 0.7;

    // Se ainda exibindo feedback da última questão, aguarda dismissal
    if (activeQuiz.showingFeedback) return;

    const npcData = dialogueData[npcId];
    if (!npcData) { clearQuiz(); return; }

    const phase = passed ? 'success' : 'fail';
    const lines = npcData[phase] || [];

    if (passed) {
      markNpcCompleted(npcId, score, total);
    }

    clearQuiz();
    setActiveDialogue({
      npcId,
      phase,
      lines,
      currentLine: 0,
      finished: false,
      score,
      total,
    });
  }, [activeQuiz?.finished, activeQuiz?.showingFeedback]);

  const handleSelectOption = useCallback(
    (index) => {
      if (!activeQuiz || activeQuiz.showingFeedback || activeQuiz.finished) return;
      setSelectedOption(index);
      answerQuestion(index);
    },
    [activeQuiz, answerQuestion]
  );

  const handleDismissFeedback = useCallback(() => {
    if (!activeQuiz?.showingFeedback) return;
    dismissFeedback();
  }, [activeQuiz, dismissFeedback]);

  // Teclado: 1-4 para selecionar, ENTER/SPACE para avançar feedback
  useEffect(() => {
    if (!activeQuiz) return;
    const onKey = (e) => {
      if (activeQuiz.showingFeedback) {
        if (['Enter', ' ', 'x', 'X'].includes(e.key)) {
          e.preventDefault();
          handleDismissFeedback();
        }
        return;
      }
      if (!activeQuiz.finished) {
        const numMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (numMap[e.key] !== undefined) {
          e.preventDefault();
          handleSelectOption(numMap[e.key]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeQuiz, handleSelectOption, handleDismissFeedback]);

  if (!activeQuiz) return null;

  const {
    npcId,
    questions,
    currentQuestion,
    score,
    showingFeedback,
    lastAnswerCorrect,
    answers,
    finished,
  } = activeQuiz;

  const total = questions.length;
  const npcData = dialogueData[npcId];
  const portrait = npcData?.portrait || null;

  // Questão atual (enquanto não terminou)
  const qIndex = showingFeedback || finished
    ? Math.max(0, currentQuestion - 1)
    : currentQuestion;
  const currentQ = questions[qIndex];

  // Resultado final
  if (finished && !showingFeedback) {
    // Isso é transitório — o useEffect cuidará da transição
    return null;
  }

  const progressPct = (qIndex / total) * 100;

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        {/* Header do Quiz */}
        <div className="quiz-header">
          <div className="quiz-npc-info">
            {portrait ? (
              <img src={portrait} alt={npcId} className="quiz-portrait" />
            ) : (
              <div className="quiz-portrait-fallback">
                {npcId?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="quiz-npc-name">{npcData ? (dialogueData[npcId]?.intro?.[0]?.speaker || npcId) : npcId}</div>
              <div className="quiz-subtitle">Quiz de Conhecimento</div>
            </div>
          </div>
          <div className="quiz-score-live">
            <span className="quiz-score-correct">{score}</span>
            <span className="quiz-score-sep">/</span>
            <span className="quiz-score-total">{qIndex}</span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
          <span className="quiz-progress-label">
            Questão {qIndex + 1} de {total}
          </span>
        </div>

        {/* Corpo: Pergunta + Opções */}
        {!showingFeedback && !finished && (
          <div className="quiz-body" key={`q-${qIndex}`}>
            <div className="quiz-question">{currentQ.question}</div>
            <div className="quiz-options">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`quiz-option ${selectedOption === idx ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                >
                  <span className="quiz-option-key">{idx + 1}</span>
                  <span className="quiz-option-text">{option}</span>
                </button>
              ))}
            </div>
            <p className="quiz-keyboard-hint">Use as teclas 1–4 para selecionar</p>
          </div>
        )}

        {/* Feedback pós-resposta */}
        {showingFeedback && currentQ && (
          <div className={`quiz-feedback ${lastAnswerCorrect ? 'correct' : 'wrong'}`}>
            <div className="quiz-feedback-icon">{lastAnswerCorrect ? '✅' : '❌'}</div>
            <div className="quiz-feedback-text">
              {lastAnswerCorrect ? 'Resposta correta!' : 'Resposta incorreta!'}
            </div>
            {!lastAnswerCorrect && (
              <div className="quiz-feedback-answer">
                <strong>Resposta correta:</strong>{' '}
                {currentQ.options[currentQ.correctAnswer]}
              </div>
            )}
            <button className="quiz-next-btn" onClick={handleDismissFeedback}>
              {currentQuestion >= total ? 'Ver Resultado' : 'Próxima Questão'} →
            </button>
            <p className="quiz-keyboard-hint">[ ENTER ] para continuar</p>
          </div>
        )}
      </div>
    </div>
  );
}
