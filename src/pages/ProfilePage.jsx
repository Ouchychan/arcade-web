import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../utils/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { username } = useAuth();
  const [profile, setProfile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [showEdit, setShowEdit] = useState(false);

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
    const fetchQuizScores = async () => {
      try {
        const res = await fetch(
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/quiz_scores/${username}`
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
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/hangman_scores/${username}`
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
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/scramble_scores/${username}`
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(
          `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles/${currentUser.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProfile(data);
        setNewUsername(data.username);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (currentUser) fetchProfile();
  }, [currentUser]);

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz record?"
    );
    if (!confirmDelete) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/quiz_scores/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setQuizHistory((prev) => prev.filter((q) => q.id !== quizId));
        setShowQuizModal(false);
        toast.success("✅ Quiz record deleted!");
      } else {
        toast.error("❌ Failed to delete quiz record.");
      }
    } catch (err) {
      console.error("❌ Error deleting quiz:", err);
      toast.error("⚠️ An error occurred while deleting.");
    }
  };

  const handleDeleteHangman = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hangman record?"
    );
    if (!confirmDelete) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/hangman_scores/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setHangmanHistory((prev) => prev.filter((score) => score.id !== id));
        setShowHangmanModal(false);
        toast.success("✅ Hangman record deleted!");
      } else {
        toast.error("❌ Failed to delete hangman record.");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ An error occurred while deleting.");
    }
  };

  const handleDeleteScramble = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scramble record?"
    );
    if (!confirmDelete) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/scramble_scores/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setScrambleHistory((prev) => prev.filter((score) => score.id !== id));
        setShowScrambleModal(false);
        toast.success("✅ Scramble record deleted!");
      } else {
        toast.error("❌ Failed to delete scramble record.");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ An error occurred while deleting.");
    }
  };

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
        <div className="card p-3 mb-4 shadow-sm">
          <p>
            <strong>Email:</strong> {currentUser?.email}
          </p>
          <Button variant="outline-primary" onClick={() => setShowEdit(true)}>
            Change Username
          </Button>
          <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Change Username</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    const token = await currentUser.getIdToken();
                    const res = await fetch(
                      `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles/${encodeURIComponent(
                        currentUser.email
                      )}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ username: newUsername }),
                      }
                    );
                    if (res.ok) {
                      const data = await res.json();
                      toast.success("✅ Username updated!");
                      // Update profile state immediately
                      setProfile((prev) => ({
                        ...prev,
                        username: data.username,
                      }));

                      // Scroll to top after update
                      window.scrollTo(0, 0);

                      // Close the modal
                      setShowEdit(false);
                    } else {
                      const data = await res.json();
                      toast.error(
                        `❌ ${data.error || "Failed to update username."}`
                      );
                    }
                  } catch (err) {
                    console.error("Update error:", err);
                    toast.error("❌ Error updating profile.");
                  }
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="row">
          {/* Quiz Game Card */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Quiz Game</h5>
                {quizHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center table-hover">
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
                            >
                              <td className="align-middle w-50">
                                {entry.score}
                              </td>
                              <td className="align-middle w-50">
                                {entry.total}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No quiz game records found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quiz Game History Modal */}
          <Modal
            show={showQuizModal}
            onHide={() => setShowQuizModal(false)}
            centered
            size="lg" // Modal size for larger screens
            contentClassName="bg-dark text-light"
            dialogClassName="modal-dialog-scrollable" // Allow scrolling inside modal if needed
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
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => handleDeleteQuiz(selectedQuiz.id)}
              >
                🗑️ Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowQuizModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Hangman Game Card */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Hangman</h5>
                {hangmanHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="align-middle w-50">Score</th>
                          <th className="align-middle w-50">Rounds</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hangmanHistory
                          .sort(
                            (a, b) =>
                              b.corrected_questions - a.corrected_questions
                          )
                          .map((entry, idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                setSelectedScore(entry);
                                setShowHangmanModal(true);
                              }}
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
                ) : (
                  <p className="text-muted">No hangman game records found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Hangman Game History Modal */}
          <Modal
            show={showHangmanModal}
            onHide={() => setShowHangmanModal(false)}
            centered
            size="lg" // Modal size for larger screens
            contentClassName="bg-dark text-light"
            dialogClassName="modal-dialog-scrollable" // Allow scrolling inside modal if needed
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
                      <li>No words recorded</li>
                    )}
                  </ul>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => handleDeleteHangman(selectedScore.id)}
              >
                🗑️ Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowHangmanModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Word Scramble Game Card */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Word Scramble</h5>
                {scrambleHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm mt-3 bg-white text-dark text-center table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="align-middle w-50">Total Wins</th>
                          <th className="align-middle w-50">Total Rounds</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scrambleHistory
                          .sort(
                            (a, b) =>
                              b.corrected_questions - a.corrected_questions
                          )
                          .map((entry, idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                setSelectedScramble(entry);
                                setShowScrambleModal(true);
                              }}
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
                ) : (
                  <p className="text-muted">
                    No word scramble game records found.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Scramble Game History Modal */}
          <Modal
            show={showScrambleModal}
            onHide={() => setShowScrambleModal(false)}
            centered
            size="lg" // Modal size for larger screens
            contentClassName="bg-dark text-light"
            dialogClassName="modal-dialog-scrollable" // Allow scrolling inside modal if needed
          >
            <Modal.Header closeButton>
              <Modal.Title>Game Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedScramble ? (
                <>
                  <p>
                    ✅ Correct Words:{" "}
                    <strong>{selectedScramble.corrected_questions}</strong>
                  </p>
                  <p>
                    ❌ Incorrect Words:{" "}
                    <strong>
                      {selectedScramble.total_questions -
                        selectedScramble.corrected_questions}
                    </strong>
                  </p>
                  <p>
                    🔁 Total Rounds:{" "}
                    <strong>{selectedScramble.total_questions}</strong>
                  </p>
                  <hr />
                  <p className="mb-1">📝 Words You Guessed:</p>
                  <ul className="list-unstyled text-light">
                    {selectedScramble.words &&
                    selectedScramble.words.length > 0 ? (
                      selectedScramble.words.map((word, index) => (
                        <li key={index}>• {word}</li>
                      ))
                    ) : (
                      <li>No words recorded</li>
                    )}
                  </ul>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => handleDeleteScramble(selectedScramble.id)}
              >
                🗑️ Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowScrambleModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
