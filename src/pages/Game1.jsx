import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/App.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-toastify";
import { BsX } from "react-icons/bs";

export default function Game1() {
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [categories, setCategories] = useState([]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const data = await res.json();
        setCategories(data.trivia_categories);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
      }
    };

    fetchCategories();

    if (showGameOver) {
      const saveScore = async () => {
        try {
          const selectedCat = categories.find(
            (cat) => cat.id.toString() === category
          );
          const categoryName = selectedCat ? selectedCat.name : "Unknown";
          console.log({
            userId,
            game: "quiz",
            score,
            total: questions.length,
            category: categoryName,
            type,
            difficulty,
          });

          await fetch(
            "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/quiz_scores",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: userId,
                game: "quiz",
                score,
                total: questions.length,
                category: categoryName,
                type,
                difficulty,
              }),
            }
          );
          console.log("✅ Score saved!");
          toast.success("✅ Score saved!");
        } catch (err) {
          console.error("❌ Failed to save score:", err);
          toast.error("❌ Failed to save score.");
        }
      };
      saveScore();
    }
  }, [showGameOver, score, questions.length]);

  useEffect(() => {
    if (questions.length === 0) return;

    const currentQ = questions[currentQIndex];
    let choices = currentQ.incorrect_answers.concat(currentQ.correct_answer);
    if (currentQ.type === "multiple") {
      setShuffledChoices(shuffle(choices));
    } else {
      setShuffledChoices(["True", "False"]);
    }
  }, [currentQIndex, questions]);

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
        setError("No questions found. Please try different settings.");
        return;
      }
      setQuestions(data.results);

      // Start 3-second countdown
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setShowQuiz(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error fetching trivia:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    if (isTransitioning || selectedAnswer !== null) return;

    const correct = questions[currentQIndex].correct_answer;
    const isCorrect = answer === correct;

    setSelectedAnswer(answer);
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) setScore((prev) => prev + 1);

    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrectAnswer(null);
      setIsTransitioning(false);

      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex((prev) => prev + 1);
      } else {
        setShowGameOver(true);
        setShowQuiz(false);
      }
    }, 1000); // 1 second transition delay
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setQuestions([]);
    setShowGameOver(false);
    setShowQuiz(false);
    fetchQuestions();
  };

  const handleExit = () => {
    setCurrentQIndex(0);
    setScore(0);
    setQuestions([]);
    setError(null);
    setShowGameOver(false);
    setShowQuiz(false);
  };

  const renderAnswers = () => {
    return shuffledChoices.map((choice, idx) => {
      let borderClass = "border-warning";
      if (selectedAnswer === choice) {
        borderClass = isCorrectAnswer ? "border-success" : "border-danger";
      }

      return (
        <Button
          key={idx}
          variant="outline-warning"
          onClick={() => handleAnswer(choice)}
          disabled={selectedAnswer !== null}
          className={`d-block my-2 w-100 text-start px-3 py-2 rounded-0 border-3 ${borderClass}`}
          style={{ transition: "border 0.3s ease-in-out" }}
        >
          {choice}
        </Button>
      );
    });
  };

  return (
    <div
      className="d-flex quiz-container"
      style={{ minHeight: "100vh", width: "100%" }}
    >
      <Sidebar />
      <div
        className="container-fluid py-4"
        style={{
          backgroundColor: "#48A9A6",
          flex: 1,
          padding: 0,
        }}
      >
        <h2 className="text-center">Quiz Game</h2>

        <p className="text-light text-center fs-6 mt-3 mb-4">
          🎮 Welcome to the Quiz Game! <br />
          Choose the number of questions you want to answer <br />
          Pick a category, difficulty, and question type (optional) <br />
          Click <strong>Start Quiz</strong> to begin <br />
          Try to answer as many correctly as you can. Good luck!
        </p>

        <div className="d-flex justify-content-center">
          <div
            className="card bg-dark text-warning p-4"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "0",
            }}
          >
            <div className="quiz-form-wrapper">
              <Form className="my-4">
                <Form.Group className="mb-3">
                  <Form.Label>Amount of Questions</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    min={1}
                    max={50}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ width: "150px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Default</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" onClick={fetchQuestions}>
                  Start Quiz
                </Button>

                {error && <p className="text-danger mt-2">⚠️ {error}</p>}
              </Form>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        <Modal
          show={showQuiz && questions.length > 0 && !showGameOver}
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
          contentClassName="bg-dark text-warning"
          dialogClassName="modal-dialog-centered modal-lg"
          style={{ backgroundColor: "#48A9A6" }}
        >
          {/* Custom Exit Button */}
          <button
            onClick={() => {
              const confirmExit = window.confirm(
                "Are you sure you want to exit the quiz?"
              );
              if (confirmExit) {
                setShowQuiz(false);
              }
            }}
            className="btn btn-outline-warning position-absolute"
            style={{ top: "10px", right: "10px", zIndex: 1051 }}
          >
            <BsX size={24} />
          </button>

          <ProgressBar
            now={((currentQIndex + 1) / questions.length) * 100}
            variant="warning"
            className="rounded-0"
          />
          <Modal.Header>
            <Modal.Title>
              Question {currentQIndex + 1} of {questions.length}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {questions[currentQIndex] && (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQIndex].question,
                  }}
                />
                <div className="mt-3">{renderAnswers()}</div>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Game Over Modal */}
        <Modal
          show={showGameOver}
          centered
          contentClassName="bg-dark text-warning"
          style={{ backgroundColor: "#48A9A6" }}
        >
          <Modal.Header>
            <Modal.Title>🎉 Game Over!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p className="fs-4 my-3">
              Your score:{" "}
              <strong>
                {score} / {questions.length}
              </strong>
            </p>
            <Button
              variant="warning"
              onClick={handleRestart}
              className="me-2 text-dark border-0 rounded-0 px-4"
            >
              Restart
            </Button>
            <Button
              variant="secondary"
              onClick={handleExit}
              className="text-warning border-0 rounded-0 px-4"
            >
              Exit
            </Button>
          </Modal.Body>
        </Modal>

        {/* Countdown Modal */}
        <Modal
          show={countdown !== null}
          centered
          contentClassName="bg-dark text-warning"
          style={{ backgroundColor: "#48A9A6" }}
        >
          <Modal.Body className="text-center fs-1">{countdown}</Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
