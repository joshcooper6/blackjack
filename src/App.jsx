import { useEffect, useState } from "react";
import createDeck from "./functions/createDeck";
import "./App.css";

function Card(props) {
  const { card, index } = props;

  return (
    <div
      className="flex border p-4 rounded-xl w-[100px] h-[150px] justify-between flex-col"
      key={index}
    >
      <div className="self-start flex-col flex">
        <span>{card.value}</span>
      </div>
      <div>{card.suit}</div>
      <div className="self-end flex-col flex">
        <span>{card.value}</span>
      </div>
    </div>
  );
}

function App() {
  const [deck, setDeck] = useState(createDeck());
  const [userCards, setUserCards] = useState({ cards: [], score: 0, numAces: 0 });
  const [computerCards, setComputerCards] = useState({ cards: [], score: 0, numAces: 0 });
  const [userName, setUserName] = useState("Joshua");
  const [roundActive, setRoundActive] = useState(false);
  const [userHold, setUserHold] = useState(false);
  const [winner, setWinner] = useState("");
  const [activePlayer, setActivePlayer] = useState("");

  let computerScore = assessCards(computerCards);
  let userScore = assessCards(userCards);

  // function recheckScores() {
  //   computerScore = assessCards(computerCards);
  //   userScore = assessCards(userCards);
  // }

  function initialDealCards() {
    const userCard1 = deck.pop();
    const computerCard1 = deck.pop();
    const userCard2 = deck.pop();
  
    setUserCards({
      cards: [userCard1, userCard2]
    });
    setComputerCards({
      cards: [computerCard1]
    });
    setDeck(deck);
  }
  

  function assessCards(cards) {
    let score = 0;
    let numAces = 0;
  
    for (let card of cards.cards) {
      switch (card.value) {
        case "ace":
          numAces++;
          score += 11;
          break;
        case "king":
        case "queen":
        case "jack":
          score += 10;
          break;
        default:
          score += parseInt(card.value);
      }
    }
  
    while (score > 21 && numAces > 0) {
      score -= 10;
      numAces--;
    }
  
    return { score, numAces };
  }
  

  function drawAnotherCard() {
    const newUserCard = deck.pop();
    const newUserCards = [...userCards.cards, newUserCard];
    const { score, numAces } = assessCards(newUserCards);
    setUserCards({ cards: newUserCards, score, numAces });
    setDeck(deck);
    dealerDraw();
    setActivePlayer("dealer");
  }

  function dealerDraw() {
    const newDealerCard = deck.pop();
    const newDealerCards = [...computerCards.cards, newDealerCard];
    const { score, numAces } = assessCards(newDealerCards);
    setComputerCards({ cards: newDealerCards, score, numAces });
    setDeck(deck);
    setActivePlayer("user");
  }

  function lastDealerDraw() {
    setUserHold(true);
    setActivePlayer("dealer");
  }

  function initializeGame() {
    restart();
    initialDealCards();
    setRoundActive(true);
    setActivePlayer("user");
  }

  function restart() {
    // creates and shuffles new deck of cards
    setDeck(createDeck());
    // reset hands of all players
    setComputerCards([]);
    setUserCards([]);
    // disables game initially
    setRoundActive(false);
    // resets result
    setWinner("");
  }

  function disableGame() {
    setRoundActive(false);
    setUserHold(false);

    const checkingForWinner = closestTo21(userScore, computerScore);
    if (checkingForWinner === assessCards(userCards)) {
      setWinner(userName);
    } else if (checkingForWinner === assessCards(computerCards)) {
      setWinner("Dealer");
    } else if (checkingForWinner === null) {
      setWinner("No one");
    }
  }

  function closestTo21(num1, num2) {
    const target = 21;
    const diff1 = Math.abs(num1 - target);
    const diff2 = Math.abs(num2 - target);

    if (num1 > target && num2 > target) {
      return null; // Both numbers are greater than 21
    } else if (num1 > target) {
      return num2;
    } else if (num2 > target) {
      return num1;
    } else if (diff1 < diff2) {
      return num1;
    } else if (diff2 < diff1) {
      return num2;
    } else {
      return null; // Both numbers are equally close to 21
    }
  }

  useEffect(() => {
    if (userHold) {
      const intervalId = setInterval(() => {
        if (computerScore > 17) {
          disableGame();
          clearInterval(intervalId);
        } else {
          dealerDraw();
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }

    if (userHold && computerScore >= 17) {
      disableGame();
    }

    if (computerScore >= 17) {
      disableGame();
    }
  }, [userHold, computerScore]);

  useEffect(() => {
    console.log(
      "deck",
      deck,
      "user cards",
      userCards,
      "computer cards",
      computerCards
    );
  }, [deck, userCards, computerCards]);

  useEffect(() => {
    console.log("current round active", roundActive);
  }, [roundActive]);

  useEffect(() => {
    if (userScore >= 21 || computerScore >= 21) {
      disableGame();
    }
  }, [userCards, computerCards, roundActive]);

  useEffect(() => {
    console.log("playing now", activePlayer);
  }, [activePlayer]);

  return (
    <div className="App">
      <div id="user">
        <h2 className="text-2xl">{userName}</h2>

        {userCards.cards.length <= 0 && <span>No cards.</span>}

        <div className="flex flex-wrap self-center gap-2 justify-center">
          {userCards.cards.map((card, index) => {
            return (
              <Card card={card} index={index} />
            );
          })}
        </div>
      </div>

      <div id="computer">
        <h2 className="text-2xl">Dealer</h2>

        {computerCards.cards.length <= 0 && <span>No cards.</span>}
        <div className="flex flex-wrap self-center gap-2 justify-center">
          {computerCards.cards.map((card, index) => {
            return (
              <Card card={card} index={index} />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col mt-10">
        <button
          className={!roundActive && winner.length > 0 ? "visible" : "hidden"}
          onClick={restart}
        >
          Restart
        </button>

        <button
          className={userCards.cards.length > 0 && "hidden"}
          onClick={initializeGame}
        >
          Deal
        </button>

        {roundActive && !userHold && (
          <>
            <button onClick={drawAnotherCard}>Draw Another</button>
            <button onClick={lastDealerDraw}>Hold</button>
          </>
        )}
      </div>

      {roundActive && userHold && (
        <h1 className="p-4 text-3xl mt-4">Dealing...</h1>
      )}

      <div className="mt-10 flex flex-col gap-2">
        <h2>Score</h2>
        <span>
          {userName}: {userScore}
        </span>
        <span>Dealer: {computerScore}</span>
      </div>

      {winner?.length > 0 && <h1>{winner} wins!</h1>}
    </div>
  );
}

export default App;
