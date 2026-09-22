import { useState, useEffect } from 'react';
import Card from './Card';

interface GameBoardProps {
  onGameEnd?: () => void;
}

// Define the card data structure
interface CardData {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const GameBoard = ({ onGameEnd }: GameBoardProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Initialize cards with pairs of emojis
  useEffect(() => {
    const emojis = ['🎮', '🎲', '🎯', '🎪'];
    const cardPairs = [...emojis, ...emojis];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    // Start timer
    const newTimer = setTimeout(() => {
      if (onGameEnd) {
        onGameEnd();
      }
    }, 60000); // 60 seconds game duration
    
    setTimer(newTimer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [onGameEnd]);

  const handleCardClick = (id: number) => {
    // Prevent clicking if two cards are already flipped
    if (flippedCards.length === 2) return;
    
    // Prevent clicking on already matched or flipped cards
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => [...prev, id]);

    // Check for matches when two cards are flipped
    if (flippedCards.length === 1) {
      const firstCard = cards.find(card => card.id === flippedCards[0]);
      const secondCard = cards.find(card => card.id === id);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard?.id || card.id === id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {cards.map(card => (
        <Card
          key={card.id}
          id={card.id}
          value={card.value}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
};