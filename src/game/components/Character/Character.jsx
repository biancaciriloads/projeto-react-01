import React from 'react';
import { motion } from 'framer-motion';
import { gridParaIso } from '../../data/mapData';
import { CATALOGO_LOJA } from '../../data/shopData';

function corDoItem(id, fallback) {
  if (!id) return fallback;
  const item = CATALOGO_LOJA.find((i) => i.id === id);
  return item ? item.cor : fallback;
}

// Sprite "pixel art" original construído inteiramente com <div>s (sem imagens externas):
// cada bloco representa uma parte do corpo, colorida conforme o item equipado.
export default function Character({ posicao, direcao, equipado, isPlayer = true, corBase = '#f0c9a0', modoPreview = false }) {
  const { left, top } = modoPreview ? { left: 0, top: 0 } : gridParaIso(posicao.x, posicao.y);

  const corCabelo = corDoItem(equipado?.cabelo, '#4a2c1a');
  const corCamiseta = corDoItem(equipado?.camiseta, '#8ecae6');
  const corCalca = corDoItem(equipado?.calca, '#343a40');
  const corCalcado = corDoItem(equipado?.calcado, '#2b2b2b');
  const corOculos = corDoItem(equipado?.oculos, null);
  const corBone = corDoItem(equipado?.bone, null);
  const corChapeu = corDoItem(equipado?.chapeu, null);
  const corPulseira = corDoItem(equipado?.pulseira, null);

  const flip = direcao === 'esquerda' ? -1 : 1;

  return (
    <motion.div
      className={`personagem-wrapper ${modoPreview ? 'personagem-preview' : ''}`}
      style={modoPreview ? undefined : { left, top }}
      animate={modoPreview ? undefined : { left, top }}
      transition={{ type: 'tween', duration: 0.12, ease: 'linear' }}
    >
      <div className="personagem-sprite" style={{ transform: `scaleX(${flip})` }}>
        {(corChapeu || corBone) && (
          <div className="parte chapeu" style={{ background: corChapeu || corBone }} />
        )}
        <div className="parte cabelo" style={{ background: corCabelo }} />
        <div className="parte cabeca" style={{ background: corBase }} />
        {corOculos && <div className="parte oculos" style={{ background: corOculos }} />}
        <div className="parte torso" style={{ background: corCamiseta }} />
        {corPulseira && <div className="parte pulseira" style={{ background: corPulseira }} />}
        <div className="parte pernas" style={{ background: corCalca }} />
        <div className="parte pes" style={{ background: corCalcado }} />
      </div>
      {isPlayer && <div className="personagem-sombra" />}
    </motion.div>
  );
}
