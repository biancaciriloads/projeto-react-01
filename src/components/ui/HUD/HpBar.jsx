import React from 'react';
import './hud.css';

export default function HpBar({ current, max }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  const cls = pct > 60 ? 'high' : pct > 30 ? 'mid' : 'low';
  return (
    <div className="hud-row">
      <span className="hud-label">HP</span>
      <div className="hp-bar-container">
        <div className={`hp-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="hud-value" style={{ fontSize: 10 }}>{current}/{max}</span>
    </div>
  );
}
