import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

/**
 * useShopStore
 * 
 * Gerencia a economia do jogo (moedas) e inventário da loja 
 * (itens comprados e os itens atualmente equipados).
 */
export const useShopStore = create(
  persist(
    (set, get) => ({
      moedas: 0,
      itensComprados: [], // array de ids
      equipado: EQUIPADO_INICIAL,
      
      adicionarMoedas: (valor) => set((state) => ({ moedas: state.moedas + valor })),
      gastarMoedas: (valor) => {
        const ok = get().moedas >= valor;
        if (ok) set((state) => ({ moedas: state.moedas - valor }));
        return ok;
      },
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
      equiparItem: (item) => set((state) => ({
        equipado: { ...state.equipado, [item.categoria]: state.equipado[item.categoria] === item.id ? null : item.id }
      })),
      removerAcessorio: (slot) => set((state) => ({
        equipado: { ...state.equipado, [slot]: null }
      }))
    }),
    {
      name: 'estetica-clinic-shop',
    }
  )
);
