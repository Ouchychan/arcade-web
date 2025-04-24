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

  const { currentUser } = useAuth();

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

    if (showGameOver && currentUser) {
      const saveScore = async () => {
        try {
          const selectedCat = categories.find(
            (cat) => cat.id.toString() === category
          );
          const categoryName = selectedCat ? selectedCat.name : "Unknown";

          await fetch(
            "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/quiz_scores",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: currentUser.email,
                game: "quiz",
                score,
                total: questions.length,
                category: categoryName, // ✅ send category name
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
  }, [showGameOver, currentUser, score, questions.length]);

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
    const currentQ = questions[currentQIndex];
    let choices = currentQ.incorrect_answers.concat(currentQ.correct_answer);
    if (currentQ.type === "multiple") choices = shuffle(choices);
    else choices = ["True", "False"];

    return choices.map((choice, idx) => (
      <Button
        key={idx}
        variant="outline-warning"
        onClick={() => handleAnswer(choice)}
        className="d-block my-2 w-100 text-start px-3 py-2 rounded-0"
      >
        {choice}
      </Button>
    ));
  };

  return (
    <div className="d-flex quiz-container">
      <Sidebar />
      <div className="container py-4" style={{ backgroundColor: "#48A9A6" }}>
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
            style={{ width: "100%", maxWidth: "500px", borderRadius: "0" }}
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
