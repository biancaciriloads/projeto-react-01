import { create } from 'zustand';

export const useGameStore = create((set) => ({
  player: { x: 4, y: 6, direction: 'down', isMoving: false, sprite: '/assets/sprites/player.png' },
  setPlayerPosition: (x, y, direction) => set((state) => ({ player: { ...state.player, x, y, direction: direction || state.player.direction } })),
  setPlayerDirection: (direction) => set((state) => ({ player: { ...state.player, direction } })),
  currentRoom: 'recepcao',
  setCurrentRoom: (room) => set({ currentRoom: room }),
  doors: { door_corridor: true, door_room1: false, door_room2: false, door_room3: false, door_room4: false, door_room5: false },
  unlockDoor: (doorKey) => set((state) => ({ doors: { ...state.doors, [doorKey]: true } })),
  activeDialogue: null,
  setActiveDialogue: (dialogue) => set({ activeDialogue: dialogue }),
  clearDialogue: () => set({ activeDialogue: null }),
  activeQuiz: null,
  setActiveQuiz: (quiz) => set({ activeQuiz: quiz }),
  clearQuiz: () => set({ activeQuiz: null }),
  gameCompleted: false,
  certificateData: null,
  setGameCompleted: (certificateData) => set({ gameCompleted: true, certificateData }),
}));
