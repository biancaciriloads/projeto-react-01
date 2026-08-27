import React from 'react';
export default function KeyCounter({ keys }) {
  return (
    <div className="hud-row">
      <span className="hud-label">🗝️</span>
      <span className="hud-value">{keys}</span>
    </div>
  );
}
