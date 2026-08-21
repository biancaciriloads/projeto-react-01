import { render, screen } from '@testing-library/react';
import App from './App';

// A aplicação agora é o minigame isométrico; o teste antigo verificava
// o quiz tradicional na tela inicial, que não existe mais nesse formato.
// Mantemos um smoke test garantindo que o jogo monta sem erros.
test('renderiza o jogo sem erros e mostra a dica de controles', () => {
  render(<App />);
  expect(screen.getByText(/Mova-se com WASD ou setas/i)).toBeInTheDocument();
});
