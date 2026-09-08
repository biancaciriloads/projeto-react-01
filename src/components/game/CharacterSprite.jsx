import React from 'react';
import useSpriteAnimation from '../../hooks/useSpriteAnimation';
import { getSpriteStyle, getCharacterSheet } from '../../constants/spriteConfig';

/**
 * CharacterSprite — Renderiza um personagem (player ou NPC) animado.
 *
 * Usa fatiamento automático via CSS `background-position` calculado
 * por `getSpriteStyle()` com base no sprite sheet LPC (32×32 por frame).
 *
 * @param {string}   characterId   id do personagem ('player' | npcId)
 * @param {string}   direction     'up' | 'down' | 'left' | 'right'
 * @param {boolean}  isMoving      true = animação walk; false = idle
 * @param {number}   [scale=1]     multiplicador de escala (ex.: 1.5 = 48×48)
 * @param {string}   [className]   classes CSS extras para o wrapper
 * @param {Object}   [style]       estilos inline extras para o wrapper
 */
const CharacterSprite = ({
  characterId = 'player',
  direction   = 'down',
  isMoving    = false,
  scale       = 1,
  className   = '',
  style       = {},
}) => {
  const animName = isMoving ? 'walk' : 'idle';
  const { frame } = useSpriteAnimation(animName, true);

  const sheetUrl   = getCharacterSheet(characterId);
  const spriteStyle = getSpriteStyle(sheetUrl, direction, animName, frame, scale);

  return (
    <div
      className={`character-sprite ${className}`}
      style={{ ...spriteStyle, ...style }}
      aria-hidden="true"
    />
  );
};

export default CharacterSprite;
