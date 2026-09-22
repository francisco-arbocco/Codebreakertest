import { render, screen, fireEvent } from '@testing-library/react';
import GuessInput from '../GuessInput';

describe('GuessInput', () => {
  test('renders number buttons and submits a 4-digit guess', () => {
    const onGuessChange = vi.fn();
    const onSubmitGuess = vi.fn();

    render(
      <GuessInput
        userGuess=""
        onGuessChange={onGuessChange}
        onSubmitGuess={onSubmitGuess}
        scratchedNumbers={[]}
      />
    );

    // click 1,2,3,4
    [1,2,3,4].forEach(n => fireEvent.click(screen.getByRole('button', { name: String(n) })));

    expect(onGuessChange).toHaveBeenLastCalledWith('1234');

    const submit = screen.getByText('Submit Guess');
    fireEvent.click(submit);

    expect(onSubmitGuess).toHaveBeenCalled();
  });

  test('prevents duplicate digits', () => {
    const onGuessChange = vi.fn();
    const onSubmitGuess = vi.fn();

    render(
      <GuessInput
        userGuess=""
        onGuessChange={onGuessChange}
        onSubmitGuess={onSubmitGuess}
        scratchedNumbers={[]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    // try clicking 1 again (button will be disabled)
    fireEvent.click(screen.getByRole('button', { name: '1' }));

    // Should remain with only one '1' in digits; last call stays '1'
    expect(onGuessChange).toHaveBeenLastCalledWith('1');
  });

  test('clear resets input', () => {
    const onGuessChange = vi.fn();
    const onSubmitGuess = vi.fn();

    render(
      <GuessInput
        userGuess=""
        onGuessChange={onGuessChange}
        onSubmitGuess={onSubmitGuess}
        scratchedNumbers={[]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByText('Clear'));

    expect(onGuessChange).toHaveBeenLastCalledWith('');
  });
});
