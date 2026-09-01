# CHECKPOINT - RPG 2D Clínica Estética BC
## Status Atual: Fase 1 (Engine Top-Down) e Organização de Assets Concluídas
### 1. Migração e Organização de Assets
- Assets movidos da pasta `Pacotes/` para a estrutura padrão em `public/assets/`:
- `public/assets/portraits/`: Retratos dos NPCs e Player para caixas de diálogo.
- `public/assets/sprites/`: Spri - `public/assets/tilesets/`: Mapeamento de interiores da clínica.
- `public/assets/ui/`: Logo e elementos retro da interface.
- `public/assets/audio/`: Efeitos sonoros e áudios do ambiente.
- Pasta `Pacotes/` removida com sucesso.
### 2. Engine Top-Down
- Movimentação em 4 direções (sem gravidade) Colisão física de paredes e mapa top-down operando.
- Estilização via CSS Puro (`image-rendering: pixelated;`).
### 3. Store Zustand (`src/store/useGameStore.js`)
- Criada com suporte a controle de grid do Player `{x, y}`, direção, salas ativas, trava/destrava de portas, modais de diálogo, quiz e emissão de certificado final.
---
**Próximo Passo (Fase 2):**
