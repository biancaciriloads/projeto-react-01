// Banco de perguntas organizado por sala/especialista.
// Mantém o mesmo formato de dados do quiz original (p, o, r, explicacao),
// apenas agrupado por sala e com recompensa em moedas variável por dificuldade.

export const SALAS_QUIZ = {
  sala1: {
    dificuldade: 'Fácil',
    moedasPorAcerto: 10,
    perguntas: [
      {
        icone: '🧴',
        p: 'Qual é a principal função do protetor solar na rotina de skincare?',
        o: ['Hidratar profundamente a pele', 'Proteger contra radiação UV e fotoenvelhecimento', 'Remover cravos e impurezas'],
        r: 1,
        explicacao: 'O protetor solar previne danos causados pela radiação ultravioleta, principal responsável pelo fotoenvelhecimento e outras lesões cutâneas.',
      },
      {
        icone: '💧',
        p: 'O que caracteriza uma pele do tipo "mista"?',
        o: ['Oleosidade na zona T e ressecamento nas laterais do rosto', 'Oleosidade uniforme em todo o rosto', 'Ausência total de oleosidade'],
        r: 0,
        explicacao: 'A pele mista apresenta maior oleosidade na "zona T" (testa, nariz e queixo) e tende a ser mais seca nas bochechas e laterais.',
      },
      {
        icone: '🌿',
        p: 'Qual é a ordem correta básica de aplicação de produtos no skincare?',
        o: ['Hidratante, limpeza, protetor solar', 'Limpeza, tratamento (sérum), hidratação, protetor solar', 'Protetor solar, limpeza, sérum'],
        r: 1,
        explicacao: 'A rotina básica segue a lógica de camadas mais leves para mais pesadas: limpeza, tratamento, hidratação e, por último, proteção solar.',
      },
    ],
  },
  sala2: {
    dificuldade: 'Fácil/Intermediária',
    moedasPorAcerto: 15,
    perguntas: [
      {
        icone: '💉',
        p: 'Qual é o principal mecanismo de ação da Toxina Botulínica tipo A?',
        o: ['Preenchimento de rugas profundas', 'Bloqueio da liberação de acetilcolina na junção neuromuscular', 'Estimulação direta de fibroblastos e colágeno tipo III'],
        r: 1,
        explicacao: 'A toxina botulínica atua bloqueando a liberação de acetilcolina, impedindo temporariamente a contração muscular responsável pelas rugas dinâmicas.',
      },
      {
        icone: '⏱️',
        p: 'Em média, quanto tempo dura o efeito da toxina botulínica?',
        o: ['1 semana', 'Cerca de 4 a 6 meses', 'Efeito permanente'],
        r: 1,
        explicacao: 'O efeito costuma durar entre 4 e 6 meses, variando conforme metabolismo individual e área tratada, sendo necessário retoque periódico.',
      },
      {
        icone: '🎯',
        p: 'Qual região é classicamente tratada com toxina botulínica para "pés de galinha"?',
        o: ['Região periorbital (ao redor dos olhos)', 'Região cervical anterior', 'Ponta do nariz'],
        r: 0,
        explicacao: 'Os "pés de galinha" são rugas dinâmicas na região periorbital, causadas pela contração do músculo orbicular do olho.',
      },
    ],
  },
  sala3: {
    dificuldade: 'Intermediária',
    moedasPorAcerto: 20,
    perguntas: [
      {
        icone: '✨',
        p: 'Qual destes é considerado um bioestimulador de colágeno composto por Ácido Poli-L-Láctico?',
        o: ['Sculptra', 'Botox', 'Preenchedor de ácido hialurônico comum'],
        r: 0,
        explicacao: 'O Sculptra é composto por Ácido Poli-L-Láctico (PLLA), que estimula gradualmente a produção de colágeno pelo próprio organismo.',
      },
      {
        icone: '🎯',
        p: 'Qual é a camada anatomofisiológica alvo preferencial para a aplicação profunda de bioestimuladores?',
        o: ['Epiderme superficial', 'Hipoderme / Derme profunda', 'Músculo estriado esquelético'],
        r: 1,
        explicacao: 'A aplicação na hipoderme ou derme profunda garante a integração correta do produto e estimula o tecido conjuntivo de sustentação.',
      },
      {
        icone: '📈',
        p: 'O efeito dos bioestimuladores de colágeno costuma ser:',
        o: ['Imediato e definitivo', 'Gradual, aparecendo ao longo de semanas/meses', 'Reversível em minutos'],
        r: 1,
        explicacao: 'Diferente de preenchedores volumizadores, os bioestimuladores atuam de forma gradual, estimulando neocolagênese ao longo do tempo.',
      },
    ],
  },
  sala4: {
    dificuldade: 'Difícil',
    moedasPorAcerto: 30,
    perguntas: [
      {
        icone: '⚠️',
        p: 'Qual é o principal risco vascular anatômico ao realizar procedimentos de preenchimento na região glabelar?',
        o: ['Hiperpigmentação melânica pós-inflamatória', 'Edema transitório autolimitado', 'Oclusão vascular da artéria supratroclear/supraorbitária'],
        r: 2,
        explicacao: 'A região glabelar possui uma rede vascular complexa; a oclusão da artéria supratroclear é uma complicação grave que exige protocolo imediato de reversão.',
      },
      {
        icone: '🩺',
        p: 'Qual enzima é utilizada como antídoto em casos de oclusão vascular por ácido hialurônico?',
        o: ['Hialuronidase', 'Colagenase', 'Lidocaína'],
        r: 0,
        explicacao: 'A hialuronidase degrada o ácido hialurônico injetado, sendo o antídoto de escolha em emergências vasculares por oclusão.',
      },
      {
        icone: '🚨',
        p: 'Qual sinal clínico é considerado um alerta precoce de oclusão vascular durante o procedimento?',
        o: ['Leve vermelhidão esperada no local da picada', 'Dor desproporcional e empalidecimento (livedo) da pele', 'Pequeno hematoma superficial'],
        r: 1,
        explicacao: 'Dor desproporcional associada a empalidecimento ou livedo sugere comprometimento vascular e exige interrupção imediata do procedimento.',
      },
    ],
  },
  sala5: {
    dificuldade: 'Especialista Master',
    moedasPorAcerto: 50,
    perguntas: [
      {
        icone: '💧',
        p: 'Qual é a principal finalidade do Ácido Hialurônico de alta reticulação (high cross-linking)?',
        o: ['Hidratação superficial de derme papilar', 'Volumização, reestruturação e sustentação profunda', 'Despigmentação de manchas melanodérmicas'],
        r: 1,
        explicacao: 'Ácidos hialurônicos altamente reticulados possuem maior coesividade e resistência, sendo indicados para estruturação de marcos faciais e volumização.',
      },
      {
        icone: '🧬',
        p: 'O que significa o termo "reologia" aplicado aos preenchedores de ácido hialurônico?',
        o: ['O estudo do comportamento de fluxo e deformação do gel', 'A cor final do produto', 'O tempo de validade do produto'],
        r: 0,
        explicacao: 'A reologia estuda propriedades como viscosidade e elasticidade (G\') do gel, determinando sua indicação para diferentes planos de aplicação.',
      },
      {
        icone: '🏆',
        p: 'Em um planejamento facial "full face", qual conceito guia a escolha das áreas prioritárias de tratamento?',
        o: ['Tratar aleatoriamente todas as áreas com o mesmo produto', 'Análise individualizada de proporções e pontos de suporte estrutural da face', 'Aplicar sempre o maior volume possível'],
        r: 1,
        explicacao: 'O planejamento avançado avalia proporções faciais e pontos de suporte estrutural (compartimentos de gordura, ligamentos) para um resultado harmônico e individualizado.',
      },
    ],
  },
};

export const ORDEM_SALAS = ['sala1', 'sala2', 'sala3', 'sala4', 'sala5'];
