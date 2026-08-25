import React from 'react';
import { motion } from 'framer-motion';
import { useGameSessionStore } from '../../store/useGameSessionStore';
import './LoadingScreen.css';

export default function LoadingScreen() {
  const loadProgress = useGameSessionStore((s) => s.loadProgress);
  const percent = Math.round(loadProgress * 100);

  return (
    <motion.div
      className="screen loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="loading-screen__label">Carregando clínica... {percent}%</p>
      <div className="loading-screen__track">
        <motion.div
          className="loading-screen__fill"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </motion.div>
  );
}
