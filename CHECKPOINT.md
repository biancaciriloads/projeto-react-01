# CHECKPOINT - RPG 2D Clínica Estética BC
## Status Atual: Etapa 2.3 (Sistema de Diálogos e Mecânica de Quiz) Concluída

---

### ✅ 1. Migração e Organização de Assets
- Assets em `public/assets/` (portraits, sprites, tilesets, ui, audio).
- Pasta `Pacotes/` removida.

### ✅ 2. Engine Top-Down
- Movimentação em 4 direções (WASD / Setas).
- Colisão com paredes (Tile 1) e portas trancadas (Tile 2).
- `image-rendering: pixelated` aplicado globalmente.

### ✅ 3. Store Zustand (`src/store/useGameStore.js`)
- Controle de grid do Player `{x, y, direction}`, salas ativas e portas.
- Persistência via `zustand/persist` (partializa apenas estado não-volátil).
- Suporte a diálogos por fases, quiz multi-step e progresso de NPCs.

### ✅ 4. Etapa 2.2 — Mapa, Câmera e Checkpoint
- Renderização de mapa contínuo via matriz de tiles (`src/data/mapData.js`).
- NPCs posicionados no grid (`data/mapData.js → npcs[]`).
- Câmera estilo Gather.town com `transform: translate3d` suave.
- Colisão e validação de portas em tempo real via Zustand.

---

### ✅ 5. Etapa 2.3 — Sistema de Diálogos e Mecânica de Quiz

#### 5.1 Detecção de Proximidade (`src/components/Map.jsx`)
- Detecção de NPC próximo por distância Manhattan ≤ 1 tile.
- Balão animado `[E] Conversar` sobre o NPC próximo (CSS puro, image-rendering: pixelated).
- Badge `✓` exibido sobre NPCs já concluídos.
- Tecla **E** dispara abertura do DialogBox.
- Movimento bloqueado automaticamente durante diálogo ou quiz.
- `nearbyNpc` armazenado no Zustand para uso pelo HUD.

#### 5.2 Caixa de Diálogo GBA (`src/components/DialogBox.jsx` + `DialogBox.css`)
- Layout estilo RPG GBA fixado na parte **inferior** da tela.
- **Portrait do NPC** à **esquerda** | texto central | **Portrait do Player** à **direita**.
- Fallback de iniciais para NPCs sem arquivo de retrato (ex: Henrique).
- Texto animado por linha com `framer-motion` (spring na entrada, fade por linha).
- Controles: tecla **E**, **Espaço** ou botão "Avançar ▶".
- Ao concluir a fase `intro` com quiz → abre QuizModal automaticamente.
- Fases `success`, `fail`, `alreadyCompleted` apenas exibem texto e fecham.

#### 5.3 Quiz Modal Interativo (`src/components/QuizModal.jsx` + `QuizModal.css`)
- Animações de entrada e saída com `framer-motion` (spring no modal, fade no overlay).
- Carrega questões de `src/data/quizData.js` pelo `npcId`.
- 3 estados animados com `AnimatePresence mode="wait"`:
  1. **Questão** — pergunta + 4 botões de opção (labels A–D)
  2. **Feedback** — ✅/❌ + resposta correta em caso de erro
  3. **Resultado** — placar final, percentual e ação (continuar / retry)
- Seleção por **mouse** ou **teclado** (1–4 ou A–D).
- Critério de aprovação: **≥ 70% de acertos**.
- **Aprovado** → `unlockDoor(doorKey)` + `markNpcCompleted()` + diálogo `success`.
- **Reprovado** → diálogo `fail` + opção **"🔄 Tentar Novamente"**.
- Barra de progresso animada com `framer-motion`.

#### 5.4 Dados de Diálogo (`src/data/dialogueData.js`)
- Scripts completos para 6 NPCs: **Enrico**, **Nicolle**, **Henrique**, **Felipe**, **Ryan**, **Dra. Bianca Cirilo**.
- Fases por NPC: `intro`, `success`, `fail`, `alreadyCompleted`.
- Linguagem técnica estética adequada para cada especialidade.

#### 5.5 Integração e Fluxo
- **InteractionPrompt** no HUD exibe nome do NPC próximo e se oculta durante modais.
- **GameScreen** monta `DialogBox` e `QuizModal` como camadas de overlay (z-index: 200 / 300).
- Progresso de NPCs **persistido** via `zustand/persist` entre sessões.
- Portas destrancadas também persistidas.

---

### ✅ 6. Etapa 2.4 — Certificado Final e Animação de Vitória
- Componente `src/components/Certificate.jsx` criado e integrado após o diálogo de vitória da Dra. Bianca Cirilo.
- Input obrigatório para o nome do jogador na tela inicial, armazenado na store Zustand e exibido no certificado.
- Animação de vitória com `react-confetti`, sincronizada com o estado de conclusão.
- Impressão e salvamento do certificado em PDF via `window.print()`, com botão oculto em `@media print`.
- Arquivos alterados: `src/components/Certificate.jsx`, `src/components/screens/StartScreen.jsx`, `src/components/screens/StartScreen.css`, `src/components/screens/GameScreen.jsx`, `src/components/DialogBox.jsx`, `src/store/useGameStore.js`.
- Dependências adicionadas: nenhuma; `react-confetti` já estava instalado.
- Como testar: iniciar a aplicação, informar um nome, clicar em `Jogar`, concluir os quizzes até a Dra. Bianca Cirilo, ser aprovado com pelo menos 70%, avançar pelo diálogo de vitória e usar o botão de impressão do certificado.
- Build de produção concluído com sucesso.
- Observações: o teste antigo da tela inicial ainda espera o texto `Mova-se com WASD ou setas`; permanecem também os warnings preexistentes de dependências de hooks.
