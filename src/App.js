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

  // Estados para os inputs
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [busca, setBusca] = useState('');

  // Função para adicionar novo procedimento
  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!novoNome.trim() || !novaCategoria.trim()) return;

    const novoItem = {
      id: Date.now(),
      nome: novoNome,
      categoria: novaCategoria,
      duracao: 'Variável',
    };

    setProcedimentos([...procedimentos, novoItem]);
    setNovoNome('');
    setNovaCategoria('');
  };

  // Filtragem baseada na busca
  const procedimentosFiltrados = procedimentos.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h2>Catálogo de Procedimentos</h2>
        <p>Gerencie seus serviços de forma simples e eficiente.</p>

        {/* Barra de Pesquisa */}
        <div style={{ margin: '15px 0', width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Pesquisar procedimento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleAdicionar} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Nome do procedimento"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
          />
          <input
            type="text"
            placeholder="Categoria (ex: Facial)"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}>
            Adicionar
          </button>
        </form>

        {/* Lista de Exibição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px' }}>
          {procedimentosFiltrados.map((item) => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', textAlign: 'left' }}>
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