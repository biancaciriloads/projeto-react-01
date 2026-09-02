import React from 'react';
import { useGameStore } from '../../../store/useGameStore';

/**
 * InteractionPrompt
 *
 * Exibe "[E] Conversar" como hint no HUD quando há um NPC próximo.
 * A exibição do balão diretamente sobre o NPC é tratada em Map.jsx.
 * Este componente serve como reforço no canto inferior da tela.
 */
export default function InteractionPrompt() {
  const nearbyNpc     = useGameStore((s) => s.nearbyNpc);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const activeQuiz    = useGameStore((s) => s.activeQuiz);

  // Não exibe se já há modal aberto
  if (!nearbyNpc || activeDialogue || activeQuiz) return null;

  return (
    <div className="interaction-prompt">
      [E] Conversar com {nearbyNpc.name}
    </div>
  );
}
