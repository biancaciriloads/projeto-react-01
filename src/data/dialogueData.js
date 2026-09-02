/**
 * dialogueData.js — Scripts de diálogo por NPC (Etapa 2.3)
 *
 * Estrutura por NPC:
 *   intro            — falas de apresentação antes do quiz
 *   success          — falas de aprovação (≥ 70% de acertos)
 *   fail             — falas de encorajamento (< 70%)
 *   alreadyCompleted — fala quando o NPC já foi concluído
 *
 * NPC sem quiz (enrico): apenas 'intro' e 'alreadyCompleted'
 */
export const dialogueData = {

  // ── Recepcionista (sem quiz) ─────────────────────────────────────────────
  enrico: {
    intro: [
      { speaker: 'Enrico', text: 'Olá! Bem-vindo(a) à Clínica BC! Sou Enrico, o recepcionista.' },
      { speaker: 'Enrico', text: 'As salas dos especialistas estão trancadas. Você precisará provar seu conhecimento para abri-las!' },
      { speaker: 'Enrico', text: 'Suba o corredor e procure os especialistas. Converse com eles pressionando [E] quando estiver próximo.' },
      { speaker: 'Enrico', text: 'Comece pela Nicolle (Sala 1 - Limpeza de Pele) ou pelo Henrique (Sala 2 - Botox). Boa sorte! 🌟' },
    ],
    alreadyCompleted: [
      { speaker: 'Enrico', text: 'Você já conhece o caminho! Continue explorando. Precisa de algo mais?' },
    ],
  },

  // ── Sala 1: Limpeza de Pele ──────────────────────────────────────────────
  nicolle: {
    intro: [
      { speaker: 'Nicolle', text: 'Olá! Sou Nicolle, especialista em Limpeza de Pele Profunda.' },
      { speaker: 'Nicolle', text: 'A pele é nosso maior órgão — cuidar dela é muito mais do que estética, é saúde!' },
      { speaker: 'Nicolle', text: 'Antes de avançar, preciso testar seu conhecimento sobre protocolos de limpeza de pele.' },
      { speaker: 'Nicolle', text: 'São 10 questões. Você precisa de 70% de acertos para liberar a próxima sala. Pronta(o)? 💆' },
    ],
    success: [
      { speaker: 'Nicolle', text: 'Incrível! Você demonstrou domínio real sobre Limpeza de Pele Profunda! 🌟' },
      { speaker: 'Nicolle', text: 'Conhece perfeitamente desde a extração de comedões até o cuidado pós-procedimento.' },
      { speaker: 'Nicolle', text: 'A porta foi destrancada. Continue sua jornada pela clínica!' },
    ],
    fail: [
      { speaker: 'Nicolle', text: 'Não foi desta vez, mas não desanime!' },
      { speaker: 'Nicolle', text: 'Revise os protocolos: vapor de ozônio, extração, alta frequência e cuidados home care.' },
      { speaker: 'Nicolle', text: 'Quando estiver pronta(o), volte e tente novamente. Você consegue! 💆' },
    ],
    alreadyCompleted: [
      { speaker: 'Nicolle', text: 'Você já passou pelo meu módulo com excelência! Continue firme nos estudos! 💆' },
    ],
  },

  // ── Sala 2: Botox e Preenchimento ───────────────────────────────────────
  henrique: {
    intro: [
      { speaker: 'Henrique', text: 'Olá! Sou Henrique, especialista em Toxina Botulínica e Preenchimento com Ácido Hialurônico.' },
      { speaker: 'Henrique', text: 'Injetáveis exigem conhecimento aprofundado de anatomia, farmacologia e protocolos de segurança.' },
      { speaker: 'Henrique', text: 'Vou aplicar 10 questões técnicas sobre Botox, AH, mecanismos de ação e condutas de emergência.' },
      { speaker: 'Henrique', text: 'Mínimo de 70% para avançar. A segurança do paciente começa no seu conhecimento! 💉' },
    ],
    success: [
      { speaker: 'Henrique', text: 'Excelente! Você demonstrou conhecimento sólido sobre injetáveis faciais! 🏆' },
      { speaker: 'Henrique', text: 'Domina os mecanismos de ação, complicações e condutas. Isso é essencial na prática clínica.' },
      { speaker: 'Henrique', text: 'Acesso liberado! Siga em frente.' },
    ],
    fail: [
      { speaker: 'Henrique', text: 'Ainda há pontos a reforçar. Anatomia e farmacologia são pilares desta especialidade.' },
      { speaker: 'Henrique', text: 'Estude com cuidado os mecanismos de ação da toxina, o antídoto do AH e condutas de oclusão vascular.' },
      { speaker: 'Henrique', text: 'Volte quando estiver mais preparado(a). Estou aqui! 💉' },
    ],
    alreadyCompleted: [
      { speaker: 'Henrique', text: 'Você já completou meu módulo! Parabéns pelo domínio técnico. Avance! 💉' },
    ],
  },

  // ── Sala 3: Bioestimuladores ─────────────────────────────────────────────
  felipe: {
    intro: [
      { speaker: 'Felipe', text: 'Boa tarde! Sou Felipe, especialista em Bioestimuladores de Colágeno.' },
      { speaker: 'Felipe', text: 'PLLA, Hidroxiapatita de Cálcio, Policaprolactona... cada um com seu mecanismo único de neocolagênese!' },
      { speaker: 'Felipe', text: 'Vou testar seu conhecimento com 10 questões sobre bioestimuladores, indicações e contraindicações.' },
      { speaker: 'Felipe', text: '70% de acertos para liberar o acesso. Bora lá! 🔬' },
    ],
    success: [
      { speaker: 'Felipe', text: 'Perfeito! Você entende profundamente os mecanismos dos bioestimuladores! ✨' },
      { speaker: 'Felipe', text: 'Da Regra dos 5 ao colágeno Tipo I — você sabe tudo! A porta está aberta.' },
    ],
    fail: [
      { speaker: 'Felipe', text: 'Bioestimuladores são complexos — biologia celular meets estética avançada.' },
      { speaker: 'Felipe', text: 'Revise os mecanismos de ação, contraindicações e o pós-procedimento e tente novamente!' },
    ],
    alreadyCompleted: [
      { speaker: 'Felipe', text: 'Expert em bioestimuladores! Você já passou aqui. Continue avançando! 🔬' },
    ],
  },

  // ── Sala 4: Tecnologias Estéticas ───────────────────────────────────────
  ryan: {
    intro: [
      { speaker: 'Ryan', text: 'E aí! Sou Ryan, especialista em Tecnologias Estéticas de Alta Performance!' },
      { speaker: 'Ryan', text: 'HIFU, Radiofrequência, Criolipólise, Laser, LIP... equipamentos poderosos que exigem técnica e segurança.' },
      { speaker: 'Ryan', text: 'Vou te desafiar com 10 questões sobre física dos equipamentos, mecanismos e protocolos de proteção.' },
      { speaker: 'Ryan', text: '70% de acertos para liberar a Sala Premium da Dra. Bianca! Topa? ⚡' },
    ],
    success: [
      { speaker: 'Ryan', text: 'Top demais! Você domina as tecnologias estéticas! ⚡🏆' },
      { speaker: 'Ryan', text: 'Do TRT do laser à criolipólise — um profissional completo!' },
      { speaker: 'Ryan', text: 'Acesso à Sala Premium desbloqueado. Vá falar com a Dra. Bianca Cirilo!' },
    ],
    fail: [
      { speaker: 'Ryan', text: 'As tecnologias estéticas exigem estudo constante — equipamentos evoluem rápido!' },
      { speaker: 'Ryan', text: 'Revise os princípios de fototermólise seletiva, SMAS e proteção ocular. Volte depois!' },
    ],
    alreadyCompleted: [
      { speaker: 'Ryan', text: 'Você já mandou bem aqui! Tech pro! Vá falar com a Dra. Bianca. ⚡' },
    ],
  },

  // ── Sala Premium: Dra. Bianca Cirilo ────────────────────────────────────
  dra_bianca: {
    intro: [
      { speaker: 'Dra. Bianca Cirilo', text: 'Bem-vindo(a) à Sala Premium! Sou a Dra. Bianca Cirilo, fundadora desta clínica.' },
      { speaker: 'Dra. Bianca Cirilo', text: 'Você percorreu um longo caminho — Limpeza de Pele, Injetáveis, Bioestimuladores e Tecnologias.' },
      { speaker: 'Dra. Bianca Cirilo', text: 'Este é o quiz final: 20 questões abrangentes de anatomia, farmacologia, protocolos e gestão clínica.' },
      { speaker: 'Dra. Bianca Cirilo', text: '70% de acertos para obter seu Certificado de Conclusão. Esta é a prova definitiva! 🌸' },
    ],
    success: [
      { speaker: 'Dra. Bianca Cirilo', text: '🎉 PARABÉNS! Você concluiu com excelência o treinamento completo da Clínica BC!' },
      { speaker: 'Dra. Bianca Cirilo', text: 'Demonstrou domínio em todas as áreas: da pele ao procedimento avançado.' },
      { speaker: 'Dra. Bianca Cirilo', text: 'Seu Certificado de Conclusão está sendo emitido. Você é um(a) profissional completo(a)! 💪🌸' },
    ],
    fail: [
      { speaker: 'Dra. Bianca Cirilo', text: 'A jornada de aprendizado é contínua na estética avançada. Não desanime!' },
      { speaker: 'Dra. Bianca Cirilo', text: 'Revise os conteúdos com cada especialista da clínica e volte quando estiver pronto(a).' },
      { speaker: 'Dra. Bianca Cirilo', text: 'A excelência se constrói com dedicação. Estarei aqui esperando! 🌸' },
    ],
    alreadyCompleted: [
      { speaker: 'Dra. Bianca Cirilo', text: 'Você já conquistou o Certificado da Clínica BC! É uma honra tê-la(o) aqui! 🌸🎉' },
    ],
  },
};
