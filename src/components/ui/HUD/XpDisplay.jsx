import React from 'react';
export default function XpDisplay({ xp }) {
  return (
    <div className="hud-row">
      <span className="hud-label">XP</span>
      <span className="hud-value">{xp}</span>
    </div>
  );
}
