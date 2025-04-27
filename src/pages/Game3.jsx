import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { BsX } from "react-icons/bs";

export default function Game3() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [correctWords, setCorrectWords] = useState([]);

  const [showGameModal, setShowGameModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const scoreRef = useRef(score);
  const questionsRef = useRef(questionsAnswered);

  const { userId } = useAuth();

  console.log("Auth context:", { userId });

  useEffect(() => {
    if (showGameModal) {
      startTimer();
      fetchWord();
    }

    if (showSummaryModal) {
      saveScrambleScore();
    }

    return () => clearInterval(timerRef.current);
  }, [showGameModal, showSummaryModal]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    questionsRef.current = questionsAnswered;
  }, [questionsAnswered]);

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

  const saveScrambleScore = async () => {
    try {
      const res = await fetch(
        "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/scramble_scores",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            total_questions: questionsRef.current,
            corrected_questions: scoreRef.current,
            words: correctWords,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      console.log("✅ Scramble score saved:", data);
      toast.success("✅ Score saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save scramble score:", err.message);
      toast.error("❌ Failed to save score");
    }
  };

  const fetchWord = async () => {
    setLoading(true);
    setGuess("");
    try {
      const res = await fetch("https://random-word-api.vercel.app/api?words=1");
      const data = await res.json();
      const original = data[0].toLowerCase();
      const scrambledWord = shuffleWord(original);
      setWord(original);
      setScrambled(scrambledWord);
    } catch (err) {
      console.error("Failed to fetch word:", err);
    } finally {
      setLoading(false);
    }
  };

  const shuffleWord = (word) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (guess.toLowerCase() === word) {
      setScore((prev) => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
      setCorrectWords((prev) => [...prev, word]);
      toast.success("🎉 Correct! You guessed the word!");
      setTimeout(() => {
        fetchWord();
        setGuess("");
      }, 1000);
    } else {
      toast.error(`❌ Wrong guess. Try again or skip!`);
    }
  };

  const handleSkip = () => {
    setQuestionsAnswered((prev) => prev + 1);
    fetchWord();
    setGuess("");
  };

  const handleStartGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectWords([]);
    setShowGameModal(true);
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#BFBC95",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          marginLeft: "20px",
          padding: "20px",
          flex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Centering the content vertically
          height: "100vh", // Ensure full height
        }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "100%", padding: "20px" }}
        >
          <h2 className="text-black fw-bold text-center mb-4">Word Scramble</h2>

          <p
            className="text-dark mb-4"
            style={{
              maxWidth: "500px",
              fontSize: "1rem",
              margin: "0 auto", // Center the text for smaller screens
            }}
          >
            🕹️ Welcome to Scramble!
            <br />
            A random word will be selected and scrambled
            <br />
            Guess the word by unscrambling the letters
            <br />
            You may keep attempting, or <strong>skip</strong> if stuck
            <br />
            Try your best to win as much in <strong>one</strong> minute
            <br />
            Good luck and have fun!
          </p>

          <Button
            className="rainbow-button fs-4 px-5 py-3"
            onClick={handleStartGame}
            style={{
              minWidth: "200px", // Ensures the button is large enough
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
          onHide={() => {
            const confirmExit = window.confirm(
              "Are you sure you want to exit the game?"
            );
            if (confirmExit) {
              setShowGameModal(false);
              clearInterval(timerRef.current);
            }
          }}
          contentClassName="text-center"
          style={{ backgroundColor: "#BFBC95" }}
        >
          {/* Custom Exit Button */}
          <button
            onClick={() => {
              const confirmExit = window.confirm(
                "Are you sure you want to exit the game?"
              );
              if (confirmExit) {
                setShowGameModal(false);
                clearInterval(timerRef.current); // stop timer
              }
            }}
            className="btn btn-outline-dark position-absolute"
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
            <Modal.Title>Word Scramble</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <p>Loading word...</p>
            ) : (
              <>
                <div className="mb-3">
                  <strong>Scrambled Word:</strong>
                  <div className="d-flex justify-content-center flex-wrap mt-2">
                    {scrambled.split("").map((char, idx) => (
                      <div
                        key={idx}
                        className="border border-dark mx-1 px-3 py-2 fs-4"
                        style={{ minWidth: "40px", backgroundColor: "#fff" }}
                      >
                        {char.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <div
                    className="rounded-circle border border-dark mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "1.5rem",
                    }}
                  >
                    {timeLeft}s
                  </div>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Enter your guess"
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <Button type="submit" className="rainbow-button me-2">
                      Submit
                    </Button>
                    <Button onClick={handleSkip} className="rainbow-button">
                      Skip
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Summary Modal */}
        <Modal
          show={showSummaryModal}
          centered
          onHide={() => setShowSummaryModal(false)}
          contentClassName="text-center"
          style={{ backgroundColor: "#BFBC95" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Game Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>⏱ Time's up!</p>
            <p>✅ Correct Answers: {score}</p>
            <p>🧠 Total Questions Attempted: {questionsAnswered}</p>
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
