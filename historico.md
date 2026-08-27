# Histórico do Projeto — Jogo 2D (Phaser + React)

## O que já foi concluído

1. **Arquitetura base** (`671fa42`) — Estrutura de pastas, config Phaser, cena básica, player com movimentação, câmera, tilemap.
2. **Sistemas de gameplay, entidades, stores e HUD** (`62a3da9`) — Implementação massiva:
   - **Entidades:** Player (com coyote time, jump buffer, pulo variável, dano/knockback/invencibilidade), Coin, Chest, Key, Door, Checkpoint.
   - **Inimigos:** BaseEnemy, BacteriaEnemy, OleosidadeEnemy, SolUVEnemy; BaseBoss + SolUVGigante.
   - **Armas:** BaseWeapon + 5 armas (Microagulhamento, LaserEstetico, PlasmaPen, SprayCriogenico, ChicoteRadiofrequencia).
   - **Sistemas:** InputController, CombatSystem, ProjectilePool, EnemyFactory, WeaponFactory, AnimationFactory, AudioManager, InteractionSystem, SaveManager.
   - **Stores (Zustand):** usePlayerStore, useGameStore, useInventoryStore, useProgressStore.
   - **HUD React:** HudRoot, HpBar, CoinCounter, KeyCounter, XpDisplay, WeaponDisplay, InteractionPrompt.
   - **Level data:** clinica01.js (definição do nível).
   - **Scene:** Clinica01Scene completa com build de entidades, eventos, respawn.
3. **Mecânica de ataque** (`b615b9f`) — `handleAttack` no Player, tecla Z no InputController, chamada no update loop.
4. **Fix: `this.input`** (`bd1db7e`) — Corrigida referência incorreta no Player.js.
5. **Limpeza** (`6371d84`) — Removidos `get_error.js` e `patch.js` (arquivos temporários de debug).

## O que foi corrigido

- Referência incorreta a `this.input` no Player.js (usava API do Phaser direto em vez do `InputController`).
- Remoção de arquivos de debug que não pertencem ao projeto.

## Estado atual

- Working tree com alterações pendentes (não commitadas, conforme instrução).
- **Correção aplicada:** asset `coin.png` criado em `public/assets/collectibles/` (spritesheet placeholder 8 frames, 16×16).
- **Fix colateral:** import `Phaser` adicionado em `ChicoteRadiofrequenciaWeapon.js` (bloqueava o build).
- Script de geração do placeholder em `scripts/generate-coin-placeholder.js`.
- Dev server compila com sucesso (`webpack compiled successfully`).
- Build de produção falha por bug pré-existente de Terser/Node v26 (não relacionado ao projeto).

## Próxima tarefa

- Testar o jogo em runtime para confirmar que a Coin renderiza e a animação `coin-idle-anim` funciona.
- Substituir `coin.png` placeholder por asset real quando disponível.
- Verificar se há outros assets faltando (mesma categoria de bug).

## Sugestão de commit

```
fix: adiciona asset coin.png e corrige import Phaser em ChicoteRadiofrequenciaWeapon

- Cria spritesheet placeholder coin.png (8 frames 16x16) em public/assets/collectibles/
- Corrige erro "Cannot read properties of undefined (reading 'duration')" na Coin
- Adiciona import Phaser faltante em ChicoteRadiofrequenciaWeapon.js
```
