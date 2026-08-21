import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { CATALOGO_LOJA } from '../../data/shopData';
import { useGameStore } from '../../store/useGameStore';

const ABAS = [
  { id: 'cabelo', label: 'Cabelos' },
  { id: 'camiseta', label: 'Camisetas' },
  { id: 'calca', label: 'Calças/Shorts' },
  { id: 'calcado', label: 'Calçados' },
  { id: 'pulseira', label: 'Pulseiras' },
  { id: 'oculos', label: 'Óculos' },
  { id: 'bone', label: 'Bonés' },
  { id: 'chapeu', label: 'Chapéus' },
];

export default function ShopModal({ aberto, onFechar }) {
  const [abaAtiva, setAbaAtiva] = useState('cabelo');
  const moedas = useGameStore((s) => s.moedas);
  const itensComprados = useGameStore((s) => s.itensComprados);
  const comprarItem = useGameStore((s) => s.comprarItem);

  const itensDaAba = CATALOGO_LOJA.filter((i) => i.categoria === abaAtiva);

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="🛍️ Loja da Clínica" largura={720}>
      <p style={{ textAlign: 'center', color: 'var(--title-color)', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
        Saldo: {moedas} 🪙
      </p>

      <div className="loja-abas">
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            className={`loja-aba ${abaAtiva === aba.id ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className="loja-grid">
        {itensDaAba.map((item) => {
          const jaComprado = itensComprados.includes(item.id);
          const podeComprar = moedas >= item.preco;
          return (
            <div key={item.id} className="loja-item-card">
              <div className="loja-item-swatch" style={{ background: item.cor }} />
              <p className="loja-item-nome">{item.nome}</p>
              <p className="loja-item-preco">{item.preco} 🪙</p>
              <button
                className="botao loja-item-btn"
                disabled={jaComprado || !podeComprar}
                onClick={() => comprarItem(item)}
              >
                {jaComprado ? 'Comprado ✓' : podeComprar ? 'Comprar' : 'Moedas insuficientes'}
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
