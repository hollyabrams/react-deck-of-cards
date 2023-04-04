import { useState, useEffect } from 'react';
import Card from './Card';


const CardDeck = () => {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(data => setDeckId(data.deck_id))
      .catch(error => console.error(error));
  }, []);

  const drawCard = () => {
    if (!deckId) {
      return;
    }
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCards([...cards, data.cards[0].image]);
        } else {
          setIsDrawing(false);
          alert('Error: no cards remaining!');
        }
      })
      .catch(error => console.error(error));
  };

  const startDrawing = () => {
    setIsDrawing(true);
    drawCard();
    setIntervalId(setInterval(drawCard, 1000));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    clearInterval(intervalId);
  };

  const shuffleDeck = () => {
    if (!deckId) {
      return;
    }
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
      .then(response => response.json())
      .then(data => setCards([]))
      .catch(error => console.error(error));
  };

  return (
    <div className="container">
      <h1>Deck of Cards</h1>
      <div className="card-container">
        {cards.map((card, index) => <Card key={index} image={card} />)}
      </div>
      <div className="button-container">
      <button className="button" onClick={isDrawing ? stopDrawing : startDrawing}>{isDrawing ? 'Stop drawing' : 'Start drawing'}</button>
      <button className="button" onClick={shuffleDeck}>Shuffle</button>
      </div>
    </div>
  );
};

export default CardDeck;

