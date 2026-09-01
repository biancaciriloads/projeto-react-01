import React from 'react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import HpBar from './HpBar';
import InteractionPrompt from './InteractionPrompt';
import './hud.css';

export default function HudRoot() {
  const hp = usePlayerStore((s) => s.hp);
  const maxHp = usePlayerStore((s) => s.maxHp);

  return (
    <div className="hud-root">
      <div className="hud-panel">
        <HpBar current={hp} max={maxHp} />
      </div>
      <InteractionPrompt />
    </div>
  );
}
