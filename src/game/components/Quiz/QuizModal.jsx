import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { SALAS_QUIZ } from '../../data/quizData';
import { useGameStore } from '../../store/useGameStore';

// Reaproveita a mesma lógica/UX do quiz original (App.js): uma pergunta por vez,
// feedback imediato ao responder, tela de fim e gabarito explicado — porém
// agora dentro de um modal, parametrizado pela sala/especialista atual.
export default function QuizModal({ npc, aberto, onFechar }) {
  const [q, setQ] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  const [respostaAtual, setRespostaAtual] = useState(null);
  const [etapa, setEtapa] = useState('quiz'); // 'quiz' | 'fim' | 'gabarito'
  const [moedasGanhas, setMoedasGanhas] = useState(0);

  const adicionarMoedas = useGameStore((s) => s.adicionarMoedas);
  const concluirSala = useGameStore((s) => s.concluirSala);
  const registrarResposta = useGameStore((s) => s.registrarResposta);

  if (!npc) return null;
  const salaInfo = SALAS_QUIZ[npc.salaId];
  if (!salaInfo) return null;
  const perguntas = salaInfo.perguntas;

  function reiniciarEstadoLocal() {
    setQ(0);
    setRespostasUsuario([]);
    setRespostaAtual(null);
    setEtapa('quiz');
    setMoedasGanhas(0);
  }

  function handleFechar() {
    reiniciarEstadoLocal();
    onFechar();
  }

  function handleResp(idx) {
    if (respostaAtual !== null) return;

    const acertou = idx === perguntas[q].r;
    registrarResposta();
    if (acertou) {
      adicionarMoedas(salaInfo.moedasPorAcerto);
      setMoedasGanhas((v) => v + salaInfo.moedasPorAcerto);
    }

    setRespostasUsuario([...respostasUsuario, { escolha: idx, correta: perguntas[q].r }]);
    setRespostaAtual(idx);

    setTimeout(() => {
      setRespostaAtual(null);
      if (q + 1 < perguntas.length) {
        setQ((v) => v + 1);
      } else {
        setEtapa('fim');
        concluirSala(npc.salaId);
      }
    }, 800);
  }

  return (
    <Modal aberto={aberto} onFechar={handleFechar} largura={640}>
      {etapa === 'quiz' && (
        <div>
          <div className="header-quiz">
            <span className="badge">Questão {q + 1} de {perguntas.length}</span>
            <span className="icone-header">{perguntas[q].icone}</span>
          </div>
          <h1 className="titulo">{npc.nome}</h1>
          <p className="pergunta-texto">{perguntas[q].p}</p>
          <div className="grid">
            {perguntas[q].o.map((op, i) => (
              <button
                key={i}
                onClick={() => handleResp(i)}
                className={`botao ${respostaAtual === perguntas[q].r && i === respostaAtual ? 'resposta-correta' : ''}`}
                disabled={respostaAtual !== null}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      )}

      {etapa === 'fim' && (
        <div style={{ textAlign: 'center' }}>
          <h1 className="titulo">🏆 Sala Concluída!</h1>
          <p className="subtitulo">Você ganhou <strong>{moedasGanhas} moedas</strong> 🪙</p>
          <button onClick={() => setEtapa('gabarito')} className="botao-primario">
            Ver Gabarito Explicado 📖
          </button>
        </div>
      )}

      {etapa === 'gabarito' && (
        <div>
          <h1 className="titulo">Gabarito & Explicações</h1>
          <div className="container-gabarito">
            {perguntas.map((item, index) => {
              const acertou = respostasUsuario[index]?.escolha === item.r;
              return (
                <div key={index} className="card-gabarito">
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: 'var(--title-color)', fontSize: 18 }}>
                    {item.icone} {index + 1}. {item.p}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: 17, color: acertou ? 'var(--correct)' : 'var(--wrong)' }}>
                    <strong>Sua resposta:</strong> {item.o[respostasUsuario[index]?.escolha]} {acertou ? '✓' : '✗'}
                  </p>
                  {!acertou && (
                    <p style={{ margin: '4px 0', fontSize: 17, color: 'var(--correct)' }}>
                      <strong>Resposta correta:</strong> {item.o[item.r]}
                    </p>
                  )}
                  <p style={{ margin: '10px 0 0 0', fontSize: 16, color: 'var(--muted-alt)', fontStyle: 'italic', background: 'var(--explic-bg)', padding: 10, borderRadius: 8 }}>
                    <strong>Explicação:</strong> {item.explicacao}
                  </p>
                </div>
              );
            })}
          </div>
          <button onClick={handleFechar} className="botao-primario">
            Voltar à Clínica 🏥
          </button>
        </div>
      )}
    </Modal>
  );
}
