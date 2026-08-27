import React from 'react';
const WEAPON_NAMES = {
  'microagulhamento': 'Microagulhamento',
  'laser-estetico': 'Laser Estético',
  'chicote-radiofrequencia': 'Chicote RF',
  'spray-criogenico': 'Spray Crio',
  'plasma-pen': 'Plasma Pen',
};
export default function WeaponDisplay({ weaponId }) {
  return (
    <div className="hud-row">
      <span className="hud-label">⚔️</span>
      <span className="hud-value">{WEAPON_NAMES[weaponId] ?? 'Sem arma'}</span>
    </div>
  );
}
