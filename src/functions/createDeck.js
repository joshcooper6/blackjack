function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function createDeck() {
  const deckOfCards = [];

  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];

  for (let suit in suits) {
    for (let value in values) {
      deckOfCards.push({ value: values[value], suit: suits[suit] });
    }
  }

  return shuffleDeck(deckOfCards);
}

export default createDeck;