import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

export default function Game2() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameStarted) {
      startNewRound();
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(120);
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

  const startNewRound = async () => {
    try {
      const res = await fetch('https://random-word-api.herokuapp.com/word?length=5');
      const data = await res.json();
      const randomWord = data[0].toLowerCase();
      console.log('Word:', randomWord);

      setWord(randomWord);
      setGuessedLetters([]);
      setAttemptsLeft(7);
      setGameOver(false);
      setWon(false);
      setShowGameModal(true);
    } catch (err) {
      console.error('Failed to fetch word:', err);
      alert('Failed to load word. Please try again.');
    }
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameOver) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    const isCorrect = word.includes(letter);
    const newAttempts = isCorrect ? attemptsLeft : attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    const hasWon = word.split('').every((l) => newGuessedLetters.includes(l));
    if (hasWon) {
      setWon(true);
      setGameOver(true);
      setScore((prev) => prev + 1);
      setRounds((prev) => prev + 1);
      return;
    }

    if (!isCorrect && newAttempts <= 0) {
      setGameOver(true);
      setRounds((prev) => prev + 1);
    }
  };

  const handleNextRound = () => {
    startNewRound();
  };

  const handleStartGame = () => {
    setScore(0);
    setRounds(0);
    setGameStarted(true);
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <span key={index} style={{ margin: '0 5px', fontSize: '24px' }}>
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '20px' }}>
        <h2>Hangman Game</h2>
        <Button variant="primary" onClick={handleStartGame}>
          Start Game
        </Button>

        {/* Game Modal */}
        <Modal show={showGameModal} centered backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Hangman Challenge</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="mb-3">
              <strong>🕒 Time Left:</strong> {timeLeft}s &nbsp;|&nbsp;
              <strong>🔁 Rounds:</strong> {rounds}
            </div>
            <h4>Word: {renderWord()}</h4>
            <h5>Attempts Left: {attemptsLeft}</h5>
            <div style={{ margin: '10px 0' }}>
              {Array.from('abcdefghijklmnopqrstuvwxyz').map((letter) => (
                <Button
                  key={letter}
                  variant="outline-primary"
                  className="m-1"
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter)}
                >
                  {letter}
                </Button>
              ))}
            </div>
            {gameOver && (
              <div className="mt-3">
                <h5>{won ? '🎉 You guessed it!' : `❌ You lost. The word was "${word}"`}</h5>
                <Button variant="success" onClick={handleNextRound}>
                  Next Word
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Summary Modal */}
        <Modal show={showSummaryModal} centered onHide={() => setShowSummaryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Game Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>🕒 Time's up!</p>
            <p>✅ Correct Words: {score}</p>
            <p>❌ Incorrect Words: {rounds - score}</p>
            <p>🔁 Total Rounds: {rounds}</p>
            <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
              Close
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
