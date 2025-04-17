import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Modal, Button } from 'react-bootstrap';

export default function Game1() {
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [categories, setCategories] = useState([]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data area
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();
        setCategories(data.trivia_categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchQuestions = async () => {
    setError(null);
    setQuestions([]);
    setShowGameOver(false);
    setCurrentQIndex(0);
    setScore(0);

    let url = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError('No questions found. Please try different settings.');
        return;
      }
      setQuestions(data.results);
      setShowQuiz(true);
    } catch (err) {
      console.error('Error fetching trivia:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  // UI functions
  // Shuffle choices
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    const correct = questions[currentQIndex].correct_answer;
    if (answer === correct) setScore((prev) => prev + 1);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setShowGameOver(true);
      setShowQuiz(false); 
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setQuestions([]);
    setShowGameOver(false); // Hide Game Over modal
    setShowQuiz(false);     // Temporarily hide the quiz modal
    fetchQuestions();       // Refetch new questions using existing settings
  };
  
  
  const handleExit = () => {
    setCurrentQIndex(0);
    setScore(0);
    setQuestions([]);
    setError(null);
    setShowGameOver(false); // <-- Hide the Game Over modal
    setShowQuiz(false);     // <-- Exit quiz mode entirely
  };

  const renderAnswers = () => {
    const currentQ = questions[currentQIndex];
    let choices = currentQ.incorrect_answers.concat(currentQ.correct_answer);
    if (currentQ.type === 'multiple') choices = shuffle(choices);
    else choices = ['True', 'False'];

      return choices.map((choice, idx) => (
        <Button
          key={idx}
          variant="outline-primary"
          onClick={() => handleAnswer(choice)}
          className="d-block my-2 w-100"
        >
          {choice}
        </Button>
     ));
    };


  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
        <h2>Quiz Game</h2>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Amount of Questions: 
            <input
              type="number"
              value={amount}
              min={1}
              max={50}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ marginLeft: '10px' }}
            />
          </label>

          <div style={{ marginTop: '10px' }}>
            <label>
              Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Default</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>
              Difficulty:
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ marginLeft: '10px' }}>
                <option value="">Default</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>
              Type:
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: '10px' }}>
                <option value="">Default</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True / False</option>
              </select>
            </label>
          </div>

          <button onClick={fetchQuestions} style={{ marginTop: '20px' }}>
            Start Quiz
          </button>

          {error && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        {questions.length > 0 && !showQuiz && !showGameOver && (
        <div>
          <h3>Questions:</h3>
          <ol>
            {questions.map((q, idx) => (
              <li key={idx}>
                <div dangerouslySetInnerHTML={{ __html: q.question }} />
                <p><strong>Answer:</strong> {q.correct_answer}</p>
              </li>
            ))}
          </ol>
        </div>
        )}

      </div>

      <Modal show={showQuiz && questions.length > 0 && !showGameOver} centered>
        <Modal.Header>
          <Modal.Title>
            Question {currentQIndex + 1} of {questions.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {questions[currentQIndex] && (
            <>
              <div dangerouslySetInnerHTML={{ __html: questions[currentQIndex].question }} />
              <div className="mt-3">{renderAnswers()}</div>
            </>
          )}
        </Modal.Body>
      </Modal>


      <Modal show={showGameOver} centered>
        <Modal.Header>
          <Modal.Title>Game Over!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Your score: {score} / {questions.length}</p>
          <Button variant="success" onClick={handleRestart} className="me-2">
            Restart
          </Button>
          <Button variant="secondary" onClick={handleExit}>
            Exit
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
