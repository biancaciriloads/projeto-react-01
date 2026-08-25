import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from '../ui/Button';
import { useGameSessionStore } from '../../store/useGameSessionStore';
import './StartScreen.css';

export default function StartScreen() {
  const startGame = useGameSessionStore((s) => s.startGame);

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
        <Button icon={Play} onClick={startGame}>
          Jogar
        </Button>
      </div>
    </motion.div>
  );
}
