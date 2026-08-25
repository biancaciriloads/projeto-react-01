import React from 'react';
import './Button.css';

/**
 * Botão reutilizável com identidade "pixel". Aceita um ícone opcional
 * (lucide-react) para reforçar a ação sem precisar de novo asset.
 */
export default function Button({ children, icon: Icon, onClick, variant = 'primary', ...rest }) {
  return (
    <button type="button" className={`pixel-button pixel-button--${variant}`} onClick={onClick} {...rest}>
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      <span>{children}</span>
    </button>
  );
}
