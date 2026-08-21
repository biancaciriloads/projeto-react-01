import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { CATALOGO_LOJA } from '../../data/shopData';
import { useGameStore } from '../../store/useGameStore';
import Character from '../Character/Character';

const CATEGORIAS_PRINCIPAIS = [
  { id: 'cabelo', label: 'Cabelo' },
  { id: 'camiseta', label: 'Camisetas' },
  { id: 'calca', label: 'Calças / Shorts' },
  { id: 'calcado', label: 'Calçados' },
];

const CATEGORIAS_ACESSORIO = [
  { id: 'pulseira', label: 'Pulseiras' },
  { id: 'oculos', label: 'Óculos' },
  { id: 'bone', label: 'Bonés' },
  { id: 'chapeu', label: 'Chapéus' },
];

export default function InventoryModal({ aberto, onFechar }) {
  const [abaAtiva, setAbaAtiva] = useState('cabelo');
  const itensComprados = useGameStore((s) => s.itensComprados);
  const equipado = useGameStore((s) => s.equipado);
  const equiparItem = useGameStore((s) => s.equiparItem);
  const removerAcessorio = useGameStore((s) => s.removerAcessorio);

  const todasCategorias = [...CATEGORIAS_PRINCIPAIS, ...CATEGORIAS_ACESSORIO];
  const ehAcessorio = CATEGORIAS_ACESSORIO.some((c) => c.id === abaAtiva);
  const itensDaAba = CATALOGO_LOJA.filter((i) => i.categoria === abaAtiva);

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="🪞 Espelho — Inventário" largura={760}>
      <div className="inventario-layout">
        <div className="inventario-preview">
          <Character
            posicao={{ x: 0, y: 0 }}
            direcao="baixo"
            equipado={equipado}
            isPlayer={false}
            modoPreview
          />
        </div>

        <div className="inventario-lista">
          <div className="loja-abas">
            {todasCategorias.map((cat) => (
              <button
                key={cat.id}
                className={`loja-aba ${abaAtiva === cat.id ? 'ativa' : ''}`}
                onClick={() => setAbaAtiva(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="loja-grid">
            {itensDaAba.map((item) => {
              const desbloqueado = itensComprados.includes(item.id);
              const equipadoAtual = equipado[abaAtiva] === item.id;
              return (
                <div key={item.id} className={`loja-item-card ${!desbloqueado ? 'bloqueado' : ''}`}>
                  <div className="loja-item-swatch" style={{ background: item.cor }} />
                  <p className="loja-item-nome">{item.nome}</p>
                  <p className="loja-item-preco">{desbloqueado ? 'Desbloqueado ✓' : '🔒 Bloqueado'}</p>
                  <button
                    className="botao loja-item-btn"
                    disabled={!desbloqueado}
                    onClick={() => equiparItem(item)}
                  >
                    {equipadoAtual ? 'Equipado ✓' : 'Equipar'}
                  </button>
                </div>
              );
            })}
          </div>

          {ehAcessorio && equipado[abaAtiva] && (
            <button className="botao" style={{ marginTop: 12 }} onClick={() => removerAcessorio(abaAtiva)}>
              Remover acessório
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
