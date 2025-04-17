import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Button, Form, Modal } from 'react-bootstrap';

export default function Game3() {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const [showGameModal, setShowGameModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    if (showGameModal) {
      startTimer();
      fetchWord();
    }

    return () => clearInterval(timerRef.current);
  }, [showGameModal]);

  // Timer logic
  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(60);
    setScore(0);
    setQuestionsAnswered(0);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowGameModal(false);
          setShowSummaryModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchWord = async () => {
    setLoading(true);
    setFeedback('');
    setGuess('');
    try {
      const res = await fetch('https://random-word-api.herokuapp.com/word?length=5');
      const data = await res.json();
      const original = data[0].toLowerCase();
      const scrambledWord = shuffleWord(original);
      setWord(original);
      setScrambled(scrambledWord);
    } catch (err) {
      console.error('Failed to fetch word:', err);
      setFeedback('Failed to fetch word. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const shuffleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (guess.toLowerCase() === word) {
      setScore(prev => prev + 1);
      setQuestionsAnswered(prev => prev + 1);
      setFeedback('✅ Correct! Loading next word...');
      setTimeout(() => {
        fetchWord();
        setGuess('');
        setFeedback('');
      }, 1000);
    } else {
      setFeedback('❌ Wrong guess. Try again or skip!');
    }
  };

  const handleSkip = () => {
    setQuestionsAnswered(prev => prev + 1);
    fetchWord();
    setFeedback('');
    setGuess('');
  };

  const handleStartGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setShowGameModal(true);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
        <h2>Word Scramble</h2>
        <Button variant="primary" onClick={handleStartGame}>
          Start Game
        </Button>

        {/* Game Modal */}
        <Modal show={showGameModal} centered onHide={() => setShowGameModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Word Scramble</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <p>Loading word...</p>
            ) : (
              <>
                <p><strong>Scrambled Word:</strong> {scrambled}</p>
                <p>⏱ Time left: {timeLeft}s</p>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Enter your guess"
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2">Submit</Button>
                  <Button variant="warning" onClick={handleSkip} className="mt-2 ms-2">Skip</Button>
                </Form>
                {feedback && <p className="mt-3">{feedback}</p>}
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Summary Modal */}
        <Modal show={showSummaryModal} centered onHide={() => setShowSummaryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Game Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>⏱ Time's up!</p>
            <p>✅ Correct Answers: {score}</p>
            <p>🧠 Total Questions Attempted: {questionsAnswered}</p>
            <Button variant="primary" onClick={() => setShowSummaryModal(false)}>Close</Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
