import React, { useCallback, useEffect, useState } from 'react';
import IsometricMap from './components/Map/IsometricMap';
import Character from './components/Character/Character';
import NPC from './components/NPC/NPC';
import HUD from './components/HUD/HUD';
import DialogueModal from './components/Dialogue/DialogueModal';
import QuizModal from './components/Quiz/QuizModal';
import ShopModal from './components/Shop/ShopModal';
import InventoryModal from './components/Inventory/InventoryModal';
import Modal from './components/Common/Modal';
import MobileWarning from './components/Common/MobileWarning';
import useMovement from './components/Character/useMovement';
import useProximity from './components/NPC/useProximity';
import { NPCS } from './data/mapData';
import { useGameStore } from './store/useGameStore';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 900);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function GameRoot() {
  const isMobile = useIsMobile();

  const posicao = useGameStore((s) => s.posicao);
  const direcao = useGameStore((s) => s.direcao);
  const equipado = useGameStore((s) => s.equipado);
  const modalAtivo = useGameStore((s) => s.modalAtivo);
  const npcAtivo = useGameStore((s) => s.npcAtivo);
  const abrirModal = useGameStore((s) => s.abrirModal);
  const fecharModal = useGameStore((s) => s.fecharModal);
  const salaDesbloqueada = useGameStore((s) => s.salaDesbloqueada);

  const jogoLivre = modalAtivo === null;

  useMovement({ ativo: jogoLivre && !isMobile });

  const onInteragir = useCallback(
    (npc) => {
      if (npc.isEspelho) {
        abrirModal('inventario', npc);
      } else if (npc.tema === 'loja') {
        abrirModal('loja', npc);
      } else if (!salaDesbloqueada(npc.salaId)) {
        abrirModal('bloqueada', npc);
      } else {
        abrirModal('dialogo', npc);
      }
    },
    [abrirModal, salaDesbloqueada]
  );

  const npcProximo = useProximity(posicao, jogoLivre && !isMobile, onInteragir);

  if (isMobile) return <MobileWarning />;

  return (
    <div className="game-container">
      <HUD />

      <IsometricMap>
        {NPCS.map((npc) => (
          <NPC key={npc.id} npc={npc} mostrarPrompt={jogoLivre && npcProximo?.id === npc.id} />
        ))}
        <Character posicao={posicao} direcao={direcao} equipado={equipado} isPlayer />
      </IsometricMap>

      <div className="controles-ajuda">Mova-se com WASD ou setas · Aperte X para interagir</div>

      <DialogueModal
        npc={modalAtivo === 'dialogo' ? npcAtivo : null}
        aberto={modalAtivo === 'dialogo'}
        onFechar={fecharModal}
        onIniciarQuiz={() => abrirModal('quiz', npcAtivo)}
      />

      <QuizModal
        npc={modalAtivo === 'quiz' ? npcAtivo : null}
        aberto={modalAtivo === 'quiz'}
        onFechar={fecharModal}
      />

      <ShopModal aberto={modalAtivo === 'loja'} onFechar={fecharModal} />

      <InventoryModal aberto={modalAtivo === 'inventario'} onFechar={fecharModal} />

      <Modal aberto={modalAtivo === 'bloqueada'} onFechar={fecharModal} titulo="🔒 Sala Bloqueada" largura={420}>
        <p className="pergunta-texto">
          Esta é a sala do especialista master. Conclua os outros quatro consultórios antes de desafiá-la.
        </p>
        <button className="botao-primario" onClick={fecharModal}>Entendi</button>
      </Modal>
    </div>
  );
}
