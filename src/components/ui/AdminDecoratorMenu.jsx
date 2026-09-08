import React, { useEffect, useMemo, useState } from 'react';
import { gameEventBus } from '../../game/events/GameEventBus';
import { getAllManifestEntries } from '../../game/data/assetManifest';
import './AdminDecoratorMenu.css';

const DEFAULT_CONFIG = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  depth: 1,
  hasCollision: false,
};

function paletteKeys() {
  const manifest = getAllManifestEntries();
  return [...manifest.spritesheets, ...manifest.images].map(({ key }) => key);
}

export default function AdminDecoratorMenu() {
  const [active, setActive] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [furniture, setFurniture] = useState([]);
  const keys = useMemo(paletteKeys, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'F12' || event.key === 'Tab') {
        event.preventDefault();
        setActive((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const offPlaced = gameEventBus.on('admin:placed-change', ({ furniture: next }) => setFurniture(next));
    const offConfig = gameEventBus.on('admin:config-change', (next) => setConfig(next));
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      offPlaced();
      offConfig();
    };
  }, []);

  useEffect(() => {
    gameEventBus.emit('admin:toggle', { active });
  }, [active]);

  const updateConfig = (patch) => {
    const next = { ...config, ...patch };
    setConfig(next);
    gameEventBus.emit('admin:update', next);
  };

  const selectAsset = (key) => {
    setSelectedKey(key);
    setConfig(DEFAULT_CONFIG);
    gameEventBus.emit('admin:select', { key });
    gameEventBus.emit('admin:update', DEFAULT_CONFIG);
  };

  const exportScenario = () => {
    gameEventBus.emit('admin:export');
  };

  useEffect(() => gameEventBus.on('admin:scenario-exported', (payload) => {
    const formatted = JSON.stringify(payload, null, 2);
    navigator.clipboard?.writeText(formatted).catch(() => undefined);
  }), []);

  if (!active) return null;

  return (
    <aside className="admin-decorator-menu" aria-label="Painel de edição visual">
      <header className="admin-decorator-header">
        <div>
          <span className="admin-kicker">EDITOR TEMPORÁRIO</span>
          <h2>Decorar clínica</h2>
        </div>
        <button type="button" className="admin-close" onClick={() => setActive(false)} aria-label="Fechar editor">×</button>
      </header>

      <label className="admin-field">
        <span>Paleta de assets</span>
        <select value={selectedKey} onChange={(event) => selectAsset(event.target.value)}>
          <option value="">Selecione um sprite ou textura</option>
          {keys.map((key) => <option key={key} value={key}>{key}</option>)}
        </select>
      </label>

      <div className="admin-control-grid">
        <label className="admin-field"><span>Rotação</span><select value={config.rotation} onChange={(event) => updateConfig({ rotation: Number(event.target.value) })}>{[0, 90, 180, 270].map((value) => <option key={value} value={value}>{value}°</option>)}</select></label>
        <label className="admin-field"><span>Depth</span><select value={config.depth} onChange={(event) => updateConfig({ depth: Number(event.target.value) })}>{[1, 2, 3].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label className="admin-field"><span>Scale X <output>{config.scaleX.toFixed(1)}</output></span><input type="number" min="0.1" max="4" step="0.1" value={config.scaleX} onChange={(event) => updateConfig({ scaleX: Number(event.target.value) })} /></label>
        <label className="admin-field"><span>Scale Y <output>{config.scaleY.toFixed(1)}</output></span><input type="number" min="0.1" max="4" step="0.1" value={config.scaleY} onChange={(event) => updateConfig({ scaleY: Number(event.target.value) })} /></label>
      </div>

      <label className="admin-check"><input type="checkbox" checked={config.hasCollision} onChange={(event) => updateConfig({ hasCollision: event.target.checked })} /> Colisão estática</label>

      <div className="admin-help">Selecione um asset. O preview segue o cursor em grade de 16px. Clique para fixar.</div>
      <button type="button" className="admin-export" onClick={exportScenario}>EXPORTAR CENÁRIO</button>
      <div className="admin-count">{furniture.length} objeto{furniture.length === 1 ? '' : 's'} fixado{furniture.length === 1 ? '' : 's'}</div>
    </aside>
  );
}
