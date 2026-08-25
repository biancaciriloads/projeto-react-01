# Clínica Estética BC — Base Arquitetural

Este documento resume as decisões tomadas ao construir a base do projeto.
Não é a documentação do jogo final — é o registro de **como e por que** a
arquitetura foi montada assim, para orientar as próximas etapas.

## 1. Separação de responsabilidades: React x Phaser

- **Phaser** desenha e simula tudo dentro do canvas: mapa, física, jogador,
  câmera. Vive inteiramente em `src/game/`.
- **React** só existe fora do canvas: tela inicial, loading, e (no futuro)
  HUD/menus/quiz/loja. Vive em `src/components/`.
- As duas camadas **nunca se importam diretamente**. A ponte é o
  `GameEventBus` (`src/game/events/GameEventBus.js`), um `EventTarget`
  simples. O Phaser emite eventos (`preload:progress`, `level:ready`,
  `level:end-reached`); o hook `usePhaserGame` escuta esses eventos e
  atualiza a store do Zustand. Isso mantém baixo acoplamento: dá para
  reescrever o HUD inteiro sem tocar em uma linha de Scene, e vice-versa.

## 2. Por que a Scene nunca guarda estado de gameplay futuro

`Clinica01Scene` não sabe nada sobre moedas, quiz ou inimigos — ela só lê
`game/data/levels/clinica01.js` e monta o que existe ali. Quando o sistema
de moedas for implementado, ele entra como um novo campo no level data +
uma nova entidade, sem precisar reescrever a Scene.

## 3. Nível como dado, não como código

O layout do corredor protótipo é um objeto JS declarativo
(`clinica01.js`), não uma sequência de chamadas imperativas espalhadas
pela Scene. Isso permite trocar esse arquivo por um mapa exportado do
Tiled no futuro sem alterar a lógica de montagem.

## 4. Reorganização dos assets

Todos os assets originais foram preservados — nada foi deletado
permanentemente, apenas reorganizado ou arquivado:

- `public/assets/characters/player/` — apenas o personagem "Adam" (idle,
  idle-anim, run). É o único com uso ativo nesta etapa.
- `public/assets/characters/npc/` — Alex, Bob e Amelia guardados para os
  futuros especialistas de cada clínica.
- `public/assets/tilesets/` e `public/assets/props/` — tilesets e móveis
  organizados por pack de origem.
- `public/assets/_legacy/` — versões duplicadas/antigas dos tilesets
  (pasta "Old" do pack Modern Interiors) arquivadas, não usadas pelo
  manifesto ativo, mas preservadas.
- `public/assets/_licenses/` — todos os arquivos de licença/README dos
  packs, centralizados (antes espalhados dentro de cada pasta).

**Decisão que precisa da sua validação:** os packs fornecidos não têm
"caixas" ou "barris" literais. Para o protótipo, usei os móveis mais
próximos do Hospital Pack (armário, latão de lixo, biohazard bin) como
obstáculos, e recortei plantas individuais (pinheiro, aloe, cacto) do
Forest Nature Pack, que originalmente vinha como uma única spritesheet.
Se quiser trocar por outros assets específicos, é só editar
`game/data/levels/clinica01.js` — nenhuma outra parte do código depende
dessas escolhas.

## 5. `assetManifest.js`: fonte única de caminhos

Nenhum outro arquivo do projeto referencia um caminho de asset
diretamente. Só o `PreloadScene` lê o manifesto e carrega tudo. Mover ou
renomear uma pasta de assets no futuro exige editar um único arquivo.

## 6. Jogador: máquina de estados simples

`Player.js` tem 4 estados (`idle`, `run`, `jump`, `fall`) resolvidos a
cada frame a partir da física do corpo (`body.blocked.down`,
`body.velocity`). Os packs não têm frames dedicados de pulo/queda — o
protótipo usa uma pose fixa do "run" como placeholder até um asset
dedicado existir (comentado em `AnimationFactory.js`).

## 7. Câmera

`CameraRig.js` configura follow com dead zone, zoom fixo (pixel-perfect
via `setRoundPixels`) e limites do mundo — isolado da Scene para facilitar
ajuste fino de "feel" sem mexer na lógica de montagem do nível.

## 8. Zustand: apenas 2 stores, e nenhum guarda gameplay

- `useGameSessionStore` — só controla qual tela React está visível
  (start/loading/playing) e o progresso do preload.
- `useSettingsStore` — esqueleto de volume/mute, já persistido via
  `storageService`, mas **nenhum áudio é tocado ainda**.

Cada novo sistema de gameplay (moedas, XP, inventário) deve ganhar sua
própria store quando for implementado — evita um único store gigante.

## 9. Serviços preparados, não implementados

- `services/storageService.js` — wrapper de `localStorage` pronto para o
  save de progresso futuro. Hoje só persiste preferências de áudio.
- `services/audioService.js` — wrapper de Howler pronto (`register`,
  `play`, `stop`, `setMuted`), mas nenhum som é registrado nesta etapa.

## 10. Ajuste de build necessário (Phaser 4 + CRA)

O Phaser 4 embute um runtime de módulos próprio que colide com a
otimização de concatenação de módulos do Create React App em produção
(`Terser: "__webpack_module_cache__" is redeclared`). A correção foi
adicionar **CRACO** (`craco.config.js`) só para desativar
`optimization.concatenateModules` — não altera mais nada do pipeline
padrão do CRA e não exige "ejetar" o projeto. Os scripts do
`package.json` (`start`/`build`/`test`) agora usam `craco` em vez de
`react-scripts` diretamente.

## O que foi deliberadamente NÃO implementado nesta etapa

Inimigos, moedas, XP, chave, especialista, quiz, loja, inventário, HUD
complexo, ataques/armas, áudio tocando e salvamento ativo — tudo isso é
escopo das próximas etapas, conforme solicitado.
