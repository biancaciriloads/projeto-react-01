import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ANIMATIONS,
  getFrameCount,
  getFrameDuration,
} from '../constants/spriteConfig';

/**
 * useSpriteAnimation — Hook de animação de sprites por frame.
 *
 * Gerencia o ciclo de frames de uma animação (idle/walk) de forma
 * declarativa: troca automaticamente o frame ativo com base no fps
 * definido em spriteConfig.ANIMATIONS.
 *
 * @param {string}  animName    'idle' | 'walk'
 * @param {boolean} [running]   false = pausa a animação no frame 0
 * @returns {{ frame: number }} frame atual (0-based dentro da animação)
 *
 * Uso típico:
 *   const { frame } = useSpriteAnimation(isMoving ? 'walk' : 'idle', true);
 *   const style = getSpriteStyle(sheet, direction, isMoving ? 'walk' : 'idle', frame);
 */
const useSpriteAnimation = (animName = 'idle', running = true) => {
  const [frame, setFrame] = useState(0);
  const frameRef  = useRef(0);
  const timerRef  = useRef(null);
  const animRef   = useRef(animName);

  // Atualiza referência quando a animação muda (reseta frame)
  useEffect(() => {
    if (animRef.current !== animName) {
      animRef.current = animName;
      frameRef.current = 0;
      setFrame(0);
    }
  }, [animName]);

  const tick = useCallback(() => {
    const count = getFrameCount(animRef.current);
    frameRef.current = (frameRef.current + 1) % count;
    setFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (!running || !ANIMATIONS[animName]) {
      // Animação pausada — mostra frame 0
      frameRef.current = 0;
      setFrame(0);
      return;
    }

    const duration = getFrameDuration(animName);
    timerRef.current = setInterval(tick, duration);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [animName, running, tick]);

  return { frame };
};

export default useSpriteAnimation;
