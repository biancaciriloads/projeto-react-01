import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // Estado para armazenar a lista de procedimentos
  const [procedimentos, setProcedimentos] = useState([
    { id: 1, nome: 'Toxina Botulínica', categoria: 'Facial', duracao: '4 meses' },
    { id: 2, nome: 'Preenchimento Labial', categoria: 'Facial', duracao: '12 meses' },
    { id: 3, nome: 'Bioestimulador de Colágeno', categoria: 'Corporal/Facial', duracao: '18 meses' },
  ]);

  // Estados para o jogo (Gamificação)
  const [xp, setXp] = useState(30);
  const [nivel, setNivel] = useState(1);
  const [conquistas, setConquistas] = useState(['Iniciante na Estética 🌟']);

  // Estados para os inputs
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [busca, setBusca] = useState('');

  // Função para adicionar procedimento e pontuar no jogo
  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!novoNome.trim() || !novaCategoria.trim()) return;

    const novoItem = {
      id: Date.now(),
      nome: novoNome,
      categoria: novaCategoria,
      duracao: 'Variável',
    };

    const novaLista = [...procedimentos, novoItem];
    setProcedimentos(novaLista);
    setNovoNome('');
    setNovaCategoria('');

    // Sistema de Pontuação e Níveis
    const novoXp = xp + 20;
    setXp(novoXp);

    if (novoXp >= 100 && nivel === 1) {
      setNivel(2);
      setConquistas((prev) => [...prev, 'Especialista em Catálogo 💼']);
    } else if (novoXp >= 200 && nivel === 2) {
      setNivel(3);
      setConquistas((prev) => [...prev, 'Mestre da Estética Avançada ✨']);
    }
  };

  // Filtragem baseada na busca
  const procedimentosFiltrados = procedimentos.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h2>🎮 Estética Quest: Gerenciador de Clínica</h2>
        <p>Cadastre procedimentos, ganhe XP e evolua sua clínica!</p>

        {/* Painel de Status do Jogador */}
        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '10px', margin: '15px 0', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#61dafb' }}>Status do Profissional</h3>
          <p style={{ margin: '5px 0' }}>⭐ <strong>Nível:</strong> {nivel}</p>
          <p style={{ margin: '5px 0' }}>✨ <strong>XP:</strong> {xp} / {nivel * 100}</p>
          <p style={{ margin: '5px 0' }}>🏆 <strong>Conquistas:</strong> {conquistas.join(', ')}</p>
        </div>

        {/* Barra de Pesquisa */}
        <div style={{ margin: '10px 0', width: '100%', maxWidth: '450px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar procedimento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleAdicionar} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '450px' }}>
          <input
            type="text"
            placeholder="Nome do procedimento"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', minWidth: '130px' }}
          />
          <input
            type="text"
            placeholder="Categoria (ex: Facial)"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', minWidth: '130px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', border: 'none', fontWeight: 'bold', backgroundColor: '#61dafb', color: '#282c34' }}>
            Cadastrar (+20 XP)
          </button>
        </form>

        {/* Lista de Exibição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '450px', maxHeight: '250px', overflowY: 'auto' }}>
          {procedimentosFiltrados.map((item) => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', textAlign: 'left', borderLeft: '4px solid #61dafb' }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.nome}</h4>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Categoria:</strong> {item.categoria}</p>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Duração:</strong> {item.duracao}</p>
            </div>
          ))}
        </div>

      </header>
    </div>
  );
}

export default App;