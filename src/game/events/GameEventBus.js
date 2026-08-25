/**
 * GameEventBus
 *
 * Canal de comunicação desacoplado entre Phaser (dentro do canvas) e React
 * (fora do canvas). Nenhuma Scene importa Zustand diretamente, e nenhum
 * componente React importa uma Scene diretamente — ambos conversam apenas
 * através destes eventos. Isso mantém as duas camadas independentes.
 *
 * Eventos emitidos pelo jogo:
 *  - 'preload:progress'  { progress: 0..1 }
 *  - 'preload:complete'
 *  - 'level:ready'        { levelKey }
 *  - 'level:end-reached'  { levelKey }  (chegou ao fim do corredor)
 */
class GameEventBus extends EventTarget {
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  on(eventName, handler) {
    const listener = (e) => handler(e.detail);
    this.addEventListener(eventName, listener);
    return () => this.removeEventListener(eventName, listener);
  }
}

export const gameEventBus = new GameEventBus();
