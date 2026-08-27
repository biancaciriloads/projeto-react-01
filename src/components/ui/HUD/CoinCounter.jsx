import React from 'react';
export default function CoinCounter({ coins }) {
  return (
    <div className="hud-row">
      <span className="hud-label">🪙</span>
      <span className="hud-value">{coins}</span>
    </div>
  );
}
