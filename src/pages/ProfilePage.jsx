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
          <p>
            <strong>Username:</strong> {profile?.username}
          </p>
          <Button variant="outline-primary" onClick={() => setShowEdit(true)}>
            Edit Profile
          </Button>
          <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
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
                      `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles/${currentUser.email}`,
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
                      toast.success("✅ Username updated!");
                      setProfile((prev) => ({
                        ...prev,
                        username: newUsername,
                      }));
                      setShowEdit(false);
                    } else {
                      toast.error("❌ Failed to update username.");
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

        {/* Quiz, Hangman, and Scramble Game Sections */}
        <div className="row">
          {[
            {
              title: "Quiz Game",
              history: quizHistory,
              setSelected: setSelectedQuiz,
              setShowModal: setShowQuizModal,
              modalContent: selectedQuiz,
              handleDelete: handleDeleteQuiz,
              gameType: "quiz",
            },
            {
              title: "Hangman Game",
              history: hangmanHistory,
              setSelected: setSelectedScore,
              setShowModal: setShowHangmanModal,
              modalContent: selectedScore,
              handleDelete: handleDeleteHangman,
              gameType: "hangman",
            },
            {
              title: "Scramble Game",
              history: scrambleHistory,
              setSelected: setSelectedScramble,
              setShowModal: setShowScrambleModal,
              modalContent: selectedScramble,
              handleDelete: handleDeleteScramble,
              gameType: "scramble",
            },
          ].map((game, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{game.title}</h5>
                  {game.history.length ? (
                    <ul className="list-group">
                      {game.history.map((score) => (
                        <li
                          key={score.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{score.score} points</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              game.setSelected(score);
                              game.setShowModal(true);
                            }}
                          >
                            Details
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No records yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
