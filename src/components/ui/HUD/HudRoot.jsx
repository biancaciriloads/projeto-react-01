import React from 'react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import HpBar from './HpBar';
import CoinCounter from './CoinCounter';
import KeyCounter from './KeyCounter';
import XpDisplay from './XpDisplay';
import WeaponDisplay from './WeaponDisplay';
import InteractionPrompt from './InteractionPrompt';
import './hud.css';

export default function HudRoot() {
  const hp = usePlayerStore((s) => s.hp);
  const maxHp = usePlayerStore((s) => s.maxHp);
  const xp = usePlayerStore((s) => s.xp);
  const coins = usePlayerStore((s) => s.coins);
  const keys = usePlayerStore((s) => s.keys);
  const weaponId = usePlayerStore((s) => s.currentWeaponId);
  
  return (
    <div className="hud-root">
      <div className="hud-panel">
        <HpBar current={hp} max={maxHp} />
        <XpDisplay xp={xp} />
        <CoinCounter coins={coins} />
        <KeyCounter keys={keys} />
        <WeaponDisplay weaponId={weaponId} />
      </div>
      <InteractionPrompt />
    </div>
  );
}
