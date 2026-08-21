import React from 'react';
import Modal from '../Common/Modal';
import { SALAS_QUIZ } from '../../data/quizData';

const FALAS_POR_TEMA = {
  'Skincare & Fundamentos': 'Olá! Antes de mais nada, vamos revisar os fundamentos do skincare — a base de tudo na estética. Preparado(a) para o desafio?',
  'Toxina Botulínica': 'Seja bem-vindo(a)! Vou te testar sobre toxina botulínica: mecanismo de ação, duração e indicações. Vamos lá?',
  'Bioestimuladores de Colágeno': 'Aqui falamos de bioestimuladores — produtos que estimulam o próprio corpo a produzir colágeno. Bora testar seus conhecimentos?',
  'Preenchimentos & Riscos Vasculares': 'Atenção: este consultório aborda um tema sério — os riscos vasculares em preenchimentos. Fique atento(a) aos detalhes!',
  'Ácido Hialurônico Avançado': 'Você chegou à sala master! Aqui as perguntas exigem conhecimento avançado de reologia e planejamento facial. Boa sorte!',
};

export default function DialogueModal({ npc, aberto, onFechar, onIniciarQuiz }) {
  if (!npc) return null;
  const salaInfo = SALAS_QUIZ[npc.salaId];
  const fala = FALAS_POR_TEMA[npc.tema] || 'Olá! Vamos testar seus conhecimentos?';

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={npc.nome} largura={520}>
      <p className="pergunta-texto" style={{ marginBottom: 8 }}>{fala}</p>
      {salaInfo && (
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
          Dificuldade: <strong>{salaInfo.dificuldade}</strong> · {salaInfo.moedasPorAcerto} moedas por acerto
        </p>
      )}
      <button className="botao-primario" onClick={onIniciarQuiz}>
        Iniciar Quiz 📖
      </button>
    </Modal>
  );
}
