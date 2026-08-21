import React, { useState, useEffect } from 'react';
import './App.css';

// Banco de perguntas com imagens atualizadas e links seguros
const perguntas = [
  {
    icone: '💉',
    imagem: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    p: 'Qual é o principal mecanismo de ação da Toxina Botulínica tipo A?',
    o: ['Preenchimento de rugas profundas', 'Bloqueio da liberação de acetilcolina na junção neuromuscular', 'Estimulação direta de fibroblastos e colágeno tipo III'],
    r: 1,
    explicacao: 'A toxina botulínica atua bloqueando a liberação de acetilcolina, impedindo temporariamente a contração muscular responsável pelas rugas dinâmicas.'
  },
  {
    icone: '✨',
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrksYGxSdaDJXodNWibrEguybl5MM0hsVepopaA0WHsFlxNWDLj5C59EIl&s=10',
    p: 'Qual destes é considerado um bioestimulador de colágeno composto por Ácido Poli-L-Láctico?',
    o: ['Sculptra', 'Radiesse', 'Ellansé'],
    r: 0,
    explicacao: 'O Sculptra é composto por Ácido Poli-L-Láctico (PLLA), que estimula gradualmente a produção de colágeno pelo próprio organismo.'
  },
  {
    icone: '🎯',
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ohh4lpCiHkZlQHqr_aLNKCt8TBEVQXT12XLu_34zDdRGKbQKazcwB78&s=10',
    p: 'Qual é a camada anatomofisiológica alvo preferencial para a aplicação profunda de bioestimuladores?',
    o: ['Epiderme superficial', 'Hipoderme / Derme profunda', 'Músculo estriado esquelético'],
    r: 1,
    explicacao: 'A aplicação na hipoderme ou derme profunda garante a integração correta do produto e estimula o tecido conjuntivo de sustentação.'
  },
  {
    icone: '⚠️',
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMioLpc7hBNmLKu7XSdUWBFHPkgpFOg11tM44NtCmqe8gLr2QIroKQ1Ao&s=10',
    p: 'Qual é o principal risco vascular anatômico ao realizar procedimentos de preenchimento na região glabelar?',
    o: ['Hiperpigmentação melânica pós-inflamatória', 'Edema transitório autolimitado', 'Oclusão vascular da Artéria Supra-troclear / Supra-orbitária'],
    r: 2,
    explicacao: 'A região glabelar possui uma rede vascular complexa; a oclusão da artéria supra-troclear é uma complicação grave que exige protocolo imediato de reversão.'
  },
  {
    icone: '💧',
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDJCkWsZ50v1gu-ITa3eTgcd5efDeo9wM6ILbBvVLNutPB3d183_LpjAzf&s=10',
    p: 'Qual é a principal finalidade do Ácido Hialurônico de alta reticulação (high cross-linking)?',
    o: ['Hidratação superficial de derme papilar', 'Volumização, reestruturação e sustentação profunda', 'Despigmentação de manchas melanodérmicas'],
    r: 1,
    explicacao: 'Ácidos hialurônicos altamente reticulados possuem maior coesividade e resistência, sendo indicados para estruturação de marcos faciais e volumização.'
  }
];

export default function App() {
  const [q, setQ] = useState(0);
  const [pts, setPts] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  const [respostaAtual, setRespostaAtual] = useState(null);
  const [etapa, setEtapa] = useState('quiz'); // 'quiz', 'fim', ou 'gabarito'
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema(tema === 'light' ? 'dark' : 'light');
  };

  const handleResp = (idx) => {
    if (respostaAtual !== null) return;

    const acertou = idx === perguntas[q].r;
    if (acertou) setPts(valorAtual => valorAtual + 20);

    setRespostasUsuario([...respostasUsuario, { escolha: idx, correta: perguntas[q].r }]);
    setRespostaAtual(idx);

    setTimeout(() => {
      setRespostaAtual(null);
      if (q + 1 < perguntas.length) {
        setQ(valorAtual => valorAtual + 1);
      } else {
        setEtapa('fim');
      }
    }, 800);
  };

  return (
    <div className="page-container">
      <button
        className="theme-toggle"
        onClick={alternarTema}
        aria-label="Alternar tema"
        title={tema === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      >
        {tema === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="glass-card">

        {/* Etapa do Quiz */}
        {etapa === 'quiz' && (
          <div>
            <div className="header-quiz">
              <span className="badge">Questão {q + 1} de {perguntas.length}</span>
              <span className="icone-header">{perguntas[q].icone}</span>
            </div>

            <div className="image-container">
              <img src={perguntas[q].imagem} alt="Ilustração estética" className="imagem-quiz" />
            </div>

            <h1 className="titulo">Estética Master Quiz</h1>
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

        {/* Etapa de Fim de Jogo */}
        {etapa === 'fim' && (
          <div style={{ textAlign: 'center' }}>
            <h1 className="titulo">🏆 Quiz Concluído!</h1>
            <p className="subtitulo">Sua pontuação: <strong>{pts} / 100 XP</strong></p>
            <p style={{ color: 'var(--muted)', fontSize: '20px', marginBottom: '30px', fontWeight: '500' }}>
              {pts >= 80 ? '✨ Excelente domínio técnico!' : '💡 Bom desempenho! Confira o gabarito detalhado abaixo para aprimorar seus conhecimentos.'}
            </p>
            <button onClick={() => setEtapa('gabarito')} className="botao-primario">
              Ver Gabarito Explicado 📖
            </button>
          </div>
        )}

        {/* Etapa de Gabarito */}
        {etapa === 'gabarito' && (
          <div>
            <h1 className="titulo">Gabarito & Explicações</h1>
            <div className="container-gabarito">
              {perguntas.map((item, index) => {
                const acertou = respostasUsuario[index]?.escolha === item.r;
                return (
                  <div key={index} className="card-gabarito">
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: 'var(--title-color)', fontSize: '18px' }}>
                      {item.icone} {index + 1}. {item.p}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '17px', color: acertou ? 'var(--correct)' : 'var(--wrong)' }}>
                      <strong>Sua resposta:</strong> {item.o[respostasUsuario[index]?.escolha]} {acertou ? '✓' : '✗'}
                    </p>
                    {!acertou && (
                      <p style={{ margin: '4px 0', fontSize: '17px', color: 'var(--correct)' }}>
                        <strong>Resposta correta:</strong> {item.o[item.r]}
                      </p>
                    )}
                    <p style={{ margin: '10px 0 0 0', fontSize: '16px', color: 'var(--muted-alt)', fontStyle: 'italic', background: 'var(--explic-bg)', padding: '10px', borderRadius: '8px' }}>
                      <strong>Explicação:</strong> {item.explicacao}
                    </p>
                  </div>
                );
              })}
            </div>
            <button onClick={() => window.location.reload()} className="botao-primario">
              Reiniciar Desafio 🔄
            </button>
          </div>
        )}

      </div>
    </div>
  );
}