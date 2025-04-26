import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-toastify";
import { BsX } from "react-icons/bs";

export default function Game2() {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [correctWords, setCorrectWords] = useState([]);

  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);

  const { currentUser } = useAuth();
  const username = currentUser?.displayName || "Anonymous";
  const user_email = currentUser?.email || "";

  console.log("Auth context:", { username, user_email, currentUser });

  useEffect(() => {
    if (gameStarted) {
      startNewRound();
      startTimer();
    }

    if (showSummaryModal) {
      saveScore(); // runs *after* modal is shown, ensuring latest score
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, showSummaryModal]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameStarted(false);
          setShowGameModal(false);
          setShowSummaryModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const saveScore = async () => {
    try {
      const response = await fetch(
        "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/hangman_scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            game: "hangman",
            corrected_questions: score,
            total_questions: rounds,
            words: correctWords,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      toast.success("✅ Score saved successfully!");
    } catch (error) {
      console.error("Error saving score:", error);
      toast.error("❌ Failed to save score");
    }
  };

  const startNewRound = async () => {
    try {
      const res = await fetch("https://random-word-api.vercel.app/api?words=1");
      const data = await res.json();
      const randomWord = data[0].toLowerCase();
      console.log("Word:", randomWord);

      setWord(randomWord);
      setGuessedLetters([]);
      setAttemptsLeft(7);
      setGameOver(false);
      setWon(false);
      setShowGameModal(true);
    } catch (err) {
      console.error("Failed to fetch word:", err);
      alert("Failed to load word. Please try again.");
    }
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameOver) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    const isCorrect = word.includes(letter);
    const newAttempts = isCorrect ? attemptsLeft : attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    const hasWon = word.split("").every((l) => newGuessedLetters.includes(l));
    if (hasWon) {
      setWon(true);
      setGameOver(true);
      setScore((prev) => prev + 1);
      setRounds((prev) => prev + 1);
      toast.success("🎉 Correct! You guessed the word!");
      setCorrectWords((prevWords) => [...prevWords, word]);
      return;
    }

    if (!isCorrect && newAttempts <= 0) {
      setGameOver(true);
      setRounds((prev) => prev + 1);
      toast.error(`❌ You lost! The word was "${word}"`);
    }
  };

  const handleNextRound = () => {
    startNewRound();
  };

  const handleStartGame = () => {
    setScore(0);
    setRounds(0);
    setCorrectWords([]);
    setGameStarted(true);
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <span key={index} style={{ margin: "0 5px", fontSize: "24px" }}>
        {guessedLetters.includes(letter) ? letter : "_"}
      </span>
    ));
  };

  const rainbowColors = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#8B00FF", // Violet
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap", // Allow wrapping on small screens
      }}
    >
      <Sidebar />
      <div style={{ padding: "20px", flex: 1, backgroundColor: "#000" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full height of the viewport
            flexDirection: "column",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2 className="text-white">Hangman Game</h2>

          <p
            className="text-light mb-4"
            style={{
              maxWidth: "500px",
              fontSize: "1rem",
              margin: "0 auto", // Center text on small screens
            }}
          >
            🕹️ Welcome to Hangman!
            <br />
            A random word will be selected
            <br />
            Guess the word one letter at a time
            <br />
            You only have <strong>seven</strong> attempts
            <br />
            You lose if you're out of attempts!
            <br />
            Try your best to win as much in <strong>two</strong> minutes
            <br />
            Good luck and have fun!
          </p>

          <Button
            variant="outline-dark"
            onClick={handleStartGame}
            className="rainbow-button"
            style={{
              fontSize: "1.5rem", // Increase font size
              padding: "12px 24px", // Increase padding to make the button larger
              minWidth: "200px", // Optional: Ensure button is wider
            }}
          >
            Start Game
          </Button>
        </div>

        {/* Game Modal */}
        <Modal
          show={showGameModal}
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
          contentClassName="bg-dark text-light rainbow-modal"
          style={{ backgroundColor: "black" }}
        >
          {/* Custom Exit Button */}
          <button
            onClick={() => {
              const confirmExit = window.confirm(
                "Are you sure you want to exit the game?"
              );
              if (confirmExit) {
                clearInterval(timerRef.current);
                setShowGameModal(false);
                setGameStarted(false);
              }
            }}
            className="btn btn-outline-light position-absolute"
            style={{
              top: "10px",
              right: "10px",
              zIndex: 1051,
              borderRadius: "50%",
              padding: "0.4rem 0.6rem",
            }}
          >
            <BsX size={24} />
          </button>

          <Modal.Header>
            <Modal.Title>Hangman Challenge</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column justify-content-between text-white bg-dark">
            {/* Top: Timer + Rounds */}
            <div className="text-center">
              <div className="mb-2">
                <strong>🔁 Rounds:</strong> {rounds}
              </div>
              <div style={{ width: 80, height: 80, margin: "0 auto" }}>
                <CircularProgressbar
                  value={timeLeft}
                  maxValue={120}
                  text={`${timeLeft}s`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#ffc107",
                    trailColor: "#333",
                    textSize: "20px",
                  })}
                />
              </div>
            </div>

            {/* Bottom: Word + Attempts */}
            <div className="text-center mb-2">
              <h4 style={{ letterSpacing: "8px" }}>{renderWord()}</h4>
              <h5>Attempts Left: {attemptsLeft}</h5>
            </div>

            <div
              style={{
                margin: "10px 0",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => {
                const color =
                  rainbowColors[
                    Math.floor(Math.random() * rainbowColors.length)
                  ];
                const isGuessed = guessedLetters.includes(letter);
                return (
                  <Button
                    key={letter}
                    variant="dark"
                    className="m-1 letter-button"
                    onClick={() => handleGuess(letter)}
                    disabled={isGuessed}
                    style={{
                      borderColor: isGuessed ? "#ccc" : color,
                      borderWidth: "2px",
                      backgroundColor: isGuessed ? "#fff" : "#000",
                      color: isGuessed ? "#000" : "#fff",
                      cursor: isGuessed ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>

            {gameOver && (
              <div className="mt-3 text-center">
                <h5>
                  {won
                    ? "🎉 You guessed it!"
                    : `❌ You lost. The word was "${word}"`}
                </h5>
                <Button
                  onClick={handleNextRound}
                  className="rainbow-button mt-2"
                >
                  Next Word
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Summary Modal */}
        <Modal
          show={showSummaryModal}
          centered
          onHide={() => setShowSummaryModal(false)}
          contentClassName="bg-dark text-light rainbow-modal"
          style={{ backgroundColor: "black" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Game Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p className="fs-4">🕒 Time's up!</p>
            <p>
              ✅ Correct Words: <strong>{score}</strong>
            </p>
            <p>
              ❌ Incorrect Words: <strong>{rounds - score}</strong>
            </p>
            <p>
              🔁 Total Rounds: <strong>{rounds}</strong>
            </p>
            <Button
              onClick={() => setShowSummaryModal(false)}
              className="rainbow-button mt-3"
            >
              Close
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
