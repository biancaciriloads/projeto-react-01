import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from '../ui/Button';
import { useGameStore } from '../../store/useGameStore';
import { useGameSessionStore } from '../../store/useGameSessionStore';
import './StartScreen.css';

export default function StartScreen() {
  const startGame = useGameSessionStore((s) => s.startGame);
  const storedPlayerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const [playerName, setPlayerNameInput] = useState(storedPlayerName || '');
  const [nameError, setNameError] = useState('');

  const handleStart = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setNameError('Informe seu nome para começar.');
      return;
    }

    setPlayerName(trimmedName);
    startGame();
  };

  return (
    <motion.div
      className="screen start-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="start-screen__panel">
        <h1 className="start-screen__title">Clínica Estética BC</h1>
        <p className="start-screen__subtitle">
          Explore corredores, aprenda com especialistas e avance de clínica em clínica.
        </p>
        <label className="start-screen__name-label" htmlFor="player-name">
          Nome do jogador
        </label>
        <input
          id="player-name"
          className="start-screen__name-input"
          type="text"
          value={playerName}
          onChange={(event) => {
            setPlayerNameInput(event.target.value);
            if (nameError) setNameError('');
          }}
          placeholder="Digite seu nome"
          autoComplete="name"
        />
        {nameError && <p className="start-screen__name-error" role="alert">{nameError}</p>}
        <Button icon={Play} onClick={handleStart}>
          Jogar
        </Button>
      </div>
    </motion.div>
  );
}
