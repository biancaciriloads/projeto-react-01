import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('destaca a resposta correta em verde', () => {
  render(<App />);

  const respostaCorreta = screen.getByRole('button', {
    name: 'Bloqueio da liberação de acetilcolina na junção neuromuscular'
  });
  fireEvent.click(respostaCorreta);

  expect(respostaCorreta).toHaveClass('resposta-correta');
});
