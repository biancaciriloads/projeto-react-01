import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useGameStore — Store central do jogo (Etapa 2.3)
 *
 * Estado gerenciado:
 *  - player: posição e direção no grid
 *  - doors: quais portas estão destrancadas
 *  - nearbyNpc: NPC dentro do raio de 1 tile (volátil, não persistido)
 *  - activeDialogue: diálogo em andamento
 *  - activeQuiz: quiz em andamento
 *  - npcProgress: quais NPCs foram concluídos (persistido)
 *  - gameCompleted / certificateData
 */
export const useGameStore = create(
  persist(
    (set, get) => ({
      // ── Player ─────────────────────────────────────────────
      player: {
        x: 4,
        y: 36,
        direction: 'down',
        isMoving: false,
        sprite: '/assets/sprites/player.png',
      },
      playerName: '',
      setPlayerName: (playerName) => set({ playerName }),
      setPlayerPosition: (x, y, direction) =>
        set((state) => ({
          player: {
            ...state.player,
            x,
            y,
            direction: direction || state.player.direction,
          },
        })),
      setPlayerDirection: (direction) =>
        set((state) => ({ player: { ...state.player, direction } })),

      // ── Salas e Portas ─────────────────────────────────────
      currentRoom: 'reception',
      setCurrentRoom: (room) => set({ currentRoom: room }),

      doors: {
        door_corridor: true,
        door_room1: false,
        door_room2: false,
        door_room3: false,
        door_room4: false,
        door_room5: false,
      },
      unlockDoor: (doorKey) =>
        set((state) => ({ doors: { ...state.doors, [doorKey]: true } })),

      // ── NPC Próximo (volátil – não persistido) ─────────────
      nearbyNpc: null,
      setNearbyNpc: (npc) => set({ nearbyNpc: npc }),

      // ── Diálogo Ativo ──────────────────────────────────────
      // shape: { npcId, lines:[{speaker,text}], currentLine, phase, score?, total? }
      activeDialogue: null,
      setActiveDialogue: (dialogue) => set({ activeDialogue: dialogue }),
      advanceDialogue: () =>
        set((state) => {
          if (!state.activeDialogue) return {};
          const next = state.activeDialogue.currentLine + 1;
          if (next >= state.activeDialogue.lines.length) {
            return {
              activeDialogue: { ...state.activeDialogue, finished: true },
            };
          }
          return {
            activeDialogue: { ...state.activeDialogue, currentLine: next },
          };
        }),
      clearDialogue: () => set({ activeDialogue: null }),

      // ── Quiz Ativo ─────────────────────────────────────────
      // shape: { npcId, questions, currentQuestion, score, answers, finished, showingFeedback, lastAnswerCorrect }
      activeQuiz: null,
      setActiveQuiz: (quiz) => set({ activeQuiz: quiz }),
      answerQuestion: (selectedIndex) =>
        set((state) => {
          if (!state.activeQuiz) return {};
          const q = state.activeQuiz;
          const currentQ = q.questions[q.currentQuestion];
          const isCorrect = selectedIndex === currentQ.correctAnswer;
          const newScore = q.score + (isCorrect ? 1 : 0);
          const newAnswers = [
            ...q.answers,
            {
              questionIndex: q.currentQuestion,
              selected: selectedIndex,
              correct: isCorrect,
            },
          ];
          const nextQuestion = q.currentQuestion + 1;
          const finished = nextQuestion >= q.questions.length;
          return {
            activeQuiz: {
              ...q,
              currentQuestion: nextQuestion,
              score: newScore,
              answers: newAnswers,
              finished,
              lastAnswerCorrect: isCorrect,
              showingFeedback: true,
            },
          };
        }),
      dismissFeedback: () =>
        set((state) => {
          if (!state.activeQuiz) return {};
          return {
            activeQuiz: { ...state.activeQuiz, showingFeedback: false },
          };
        }),
      clearQuiz: () => set({ activeQuiz: null }),

      // ── Progresso de NPCs (persistido) ─────────────────────
      npcProgress: {},
      markNpcCompleted: (npcId, score, total) =>
        set((state) => ({
          npcProgress: {
            ...state.npcProgress,
            [npcId]: { completed: true, score, total },
          },
        })),

      // ── Conclusão do jogo ──────────────────────────────────
      gameCompleted: false,
      certificateData: null,
      setGameCompleted: (certificateData) =>
        set({ gameCompleted: true, certificateData }),
    }),
    {
      name: 'estetica-clinic-game-v23',
      // Apenas estado que deve sobreviver a refreshes
      partialize: (state) => ({
        doors: state.doors,
        npcProgress: state.npcProgress,
        gameCompleted: state.gameCompleted,
        certificateData: state.certificateData,
        player: state.player,
        playerName: state.playerName,
      }),
    }
  )
);
