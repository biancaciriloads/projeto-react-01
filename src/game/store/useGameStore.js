import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { POSICAO_INICIAL } from '../data/mapData';
import { ORDEM_SALAS } from '../data/quizData';

// Slots de equipamento independentes entre si.
const EQUIPADO_INICIAL = {
  cabelo: null,
  camiseta: null,
  calca: null,
  calcado: null,
  pulseira: null,
  oculos: null,
  bone: null,
  chapeu: null,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      // ---------- Personagem / movimentação ----------
      posicao: POSICAO_INICIAL,
      direcao: 'baixo', // baixo | cima | esquerda | direita
      setPosicao: (posicao) => set({ posicao }),
      setDirecao: (direcao) => set({ direcao }),

      // ---------- Economia ----------
      moedas: 0,
      adicionarMoedas: (valor) => set((state) => ({ moedas: state.moedas + valor })),
      gastarMoedas: (valor) => {
        const ok = get().moedas >= valor;
        if (ok) set((state) => ({ moedas: state.moedas - valor }));
        return ok;
      },

      // ---------- Loja / Inventário ----------
      itensComprados: [], // array de ids
      equipado: EQUIPADO_INICIAL,
      comprarItem: (item) => {
        const { moedas, itensComprados } = get();
        if (itensComprados.includes(item.id)) return false;
        if (moedas < item.preco) return false;
        set({
          moedas: moedas - item.preco,
          itensComprados: [...itensComprados, item.id],
        });
        return true;
      },
      equiparItem: (item) =>
        set((state) => ({
          equipado: { ...state.equipado, [item.categoria]: state.equipado[item.categoria] === item.id ? null : item.id },
        })),
      removerAcessorio: (slot) =>
        set((state) => ({ equipado: { ...state.equipado, [slot]: null } })),

      // ---------- Progresso das salas / quiz ----------
      salasConcluidas: [], // array de salaIds
      concluirSala: (salaId) =>
        set((state) =>
          state.salasConcluidas.includes(salaId)
            ? state
            : { salasConcluidas: [...state.salasConcluidas, salaId] }
        ),
      salaDesbloqueada: (salaId) => {
        if (salaId !== 'sala5') return true;
        const { salasConcluidas } = get();
        return ORDEM_SALAS.slice(0, 4).every((id) => salasConcluidas.includes(id));
      },
      perguntasRespondidas: 0,
      registrarResposta: () => set((state) => ({ perguntasRespondidas: state.perguntasRespondidas + 1 })),

      // ---------- Modal / UI ----------
      // tipo: null | 'dialogo' | 'quiz' | 'loja' | 'inventario'
      modalAtivo: null,
      npcAtivo: null,
      abrirModal: (tipo, npc = null) => set({ modalAtivo: tipo, npcAtivo: npc }),
      fecharModal: () => set({ modalAtivo: null, npcAtivo: null }),
    }),
    {
      name: 'estetica-clinic-save',
      partialize: (state) => ({
        posicao: state.posicao,
        moedas: state.moedas,
        itensComprados: state.itensComprados,
        equipado: state.equipado,
        salasConcluidas: state.salasConcluidas,
        perguntasRespondidas: state.perguntasRespondidas,
      }),
    }
  )
);
