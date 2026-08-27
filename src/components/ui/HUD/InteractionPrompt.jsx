import React from 'react';
import { useGameStore } from '../../../store/useGameStore';
export default function InteractionPrompt() {
  const nearby = useGameStore((s) => s.nearbyInteractable);
  if (!nearby) return null;
  return <div className="interaction-prompt">PRESSIONE X</div>;
}
