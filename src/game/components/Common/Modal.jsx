import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Painel inline (não é navegação/rota) usado por Diálogo, Quiz, Loja e Inventário,
// mantendo a mesma identidade visual em todos os casos, sobreposto ao mapa.
export default function Modal({ aberto, onFechar, titulo, largura = 640, children }) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
        >
          <motion.div
            className="glass-card modal-painel"
            style={{ maxWidth: largura }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(titulo || onFechar) && (
              <div className="modal-header">
                {titulo && <h2 className="titulo modal-titulo">{titulo}</h2>}
                {onFechar && (
                  <button className="modal-fechar" onClick={onFechar} aria-label="Fechar">
                    ✕
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
