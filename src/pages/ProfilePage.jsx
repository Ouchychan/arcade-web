import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../utils/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [hangmanHistory, setHangmanHistory] = useState([]);
  const [scrambleHistory, setScrambleHistory] = useState([]);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [selectedScore, setSelectedScore] = useState(null);
  const [showHangmanModal, setShowHangmanModal] = useState(false);

  const [showScrambleModal, setShowScrambleModal] = useState(false);
  const [selectedScramble, setSelectedScramble] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchQuizScores = async () => {
      try {
        const res = await fetch(
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/quiz_scores/${currentUser.email}`
        );
        const data = await res.json();
        setQuizHistory(data);
      } catch (err) {
        console.error("❌ Failed to fetch quiz scores:", err);
      }
    };

    const fetchHangmanScores = async () => {
      try {
        const res = await fetch(
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/hangman_scores/${currentUser.email}`
        );
        const data = await res.json();
        setHangmanHistory(data);
      } catch (err) {
        console.error("❌ Failed to fetch hangman scores:", err);
      }
    };

    const fetchScrambleScores = async () => {
      try {
        const res = await fetch(
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/scramble_scores/${currentUser.email}`
        );
        const data = await res.json();
        setScrambleHistory(data);
      } catch (err) {
        console.error("❌ Failed to fetch scramble scores:", err);
      }
    };

    fetchQuizScores();
    fetchHangmanScores();
    fetchScrambleScores();
  }, [currentUser]);

  return (
    <div
      className="d-flex"
      style={{
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        minHeight: "100vh",
        color: "#FFA500",
      }}
    >
      <Sidebar />
      <div className="container mt-4 p-4">
        <h2 className="mb-3">Your Game Profile</h2>
        <p className="mb-4">
          <strong>Email:</strong> {currentUser?.email || "Unknown"}
        </p>

        <div className="row">
          {/* Quiz Game Card */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Quiz Game</h5>
                <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="align-middle w-50">Score</th>
                      <th className="align-middle w-50">Total Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory
                      .sort((a, b) => b.score - a.score)
                      .map((entry, idx) => (
                        <tr
                          key={idx}
                          onClick={() => {
                            setSelectedQuiz(entry);
                            setShowQuizModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                          className="table-row-hover"
                        >
                          <td className="align-middle w-50">{entry.score}</td>
                          <td className="align-middle w-50">{entry.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Modal
            show={showQuizModal}
            onHide={() => setShowQuizModal(false)}
            centered
            contentClassName="text-center"
          >
            <Modal.Header closeButton>
              <Modal.Title>Quiz Game Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedQuiz ? (
                <>
                  <p>
                    🏆 <strong>Score:</strong> {selectedQuiz.score}
                  </p>
                  <p>
                    🧠 <strong>Total Questions:</strong> {selectedQuiz.total}
                  </p>
                  <p>
                    📘 <strong>Type:</strong> {selectedQuiz.type}
                  </p>
                  <p>
                    📚 <strong>Category:</strong> {selectedQuiz.category}
                  </p>
                  <p>
                    🔥 <strong>Difficulty:</strong> {selectedQuiz.difficulty}
                  </p>
                  <p>
                    🗓️ <strong>Date:</strong>{" "}
                    {new Date(selectedQuiz.created_at).toLocaleString()}
                  </p>
                </>
              ) : (
                <p>No data available.</p>
              )}
            </Modal.Body>
          </Modal>

          {/* Hangman Game Card */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Hangman</h5>
                <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="align-middle w-50">Score</th>
                      <th className="align-middle w-50">Rounds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hangmanHistory
                      .sort(
                        (a, b) => b.corrected_questions - a.corrected_questions
                      )
                      .map((entry, idx) => (
                        <tr
                          key={idx}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedScore(entry);
                            setShowHangmanModal(true);
                          }}
                          className="table-row-hover"
                        >
                          <td className="align-middle w-50">
                            {entry.corrected_questions}
                          </td>
                          <td className="align-middle w-50">
                            {entry.total_questions}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Hangman Game History Modal */}
          <Modal
            show={showHangmanModal}
            onHide={() => setShowHangmanModal(false)}
            centered
            contentClassName="bg-dark text-light"
          >
            <Modal.Header closeButton>
              <Modal.Title>Hangman Game Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedScore ? (
                <>
                  <p>
                    ✅ Correct Words:{" "}
                    <strong>{selectedScore.corrected_questions}</strong>
                  </p>
                  <p>
                    ❌ Incorrect Words:{" "}
                    <strong>
                      {selectedScore.total_questions -
                        selectedScore.corrected_questions}
                    </strong>
                  </p>
                  <p>
                    🔁 Total Rounds:{" "}
                    <strong>{selectedScore.total_questions}</strong>
                  </p>
                  <hr />
                  <p className="mb-1">📝 Words You Guessed:</p>
                  <ul className="list-unstyled text-light">
                    {selectedScore.words && selectedScore.words.length > 0 ? (
                      selectedScore.words.map((word, index) => (
                        <li key={index}>• {word}</li>
                      ))
                    ) : (
                      <li className="text-muted">No words recorded</li>
                    )}
                  </ul>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowHangmanModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Word Scramble Game Card */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Word Scramble</h5>
                <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="align-middle w-50">Total Wins</th>
                      <th className="align-middle w-50">Total Rounds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scrambleHistory
                      .sort(
                        (a, b) => b.corrected_questions - a.corrected_questions
                      )
                      .map((entry, idx) => (
                        <tr
                          key={idx}
                          onClick={() => {
                            setSelectedScramble(entry);
                            setShowScrambleModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                          className="table-row-hover"
                        >
                          <td className="align-middle w-50">
                            {entry.corrected_questions}
                          </td>
                          <td className="align-middle w-50">
                            {entry.total_questions}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Scramble Game History Modal */}
          <Modal
            show={showScrambleModal}
            onHide={() => setShowScrambleModal(false)}
            centered
            contentClassName="text-center"
          >
            <Modal.Header closeButton>
              <Modal.Title>Game Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedScramble ? (
                <>
                  <p>
                    🏆 <strong>Total Correct:</strong>{" "}
                    {selectedScramble.corrected_questions}
                  </p>
                  <p>
                    🎯 <strong>Total Attempted:</strong>{" "}
                    {selectedScramble.total_questions}
                  </p>
                  <p>
                    🗓️ <strong>Date:</strong>{" "}
                    {new Date(selectedScramble.created_at).toLocaleString()}
                  </p>

                  {selectedScramble.words &&
                    selectedScramble.words.length > 0 && (
                      <>
                        <hr />
                        <h6>Correct Words:</h6>
                        <ul className="list-group">
                          {selectedScramble.words.map((word, i) => (
                            <li key={i} className="list-group-item">
                              {word}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </>
              ) : (
                <p>No game data available</p>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}
