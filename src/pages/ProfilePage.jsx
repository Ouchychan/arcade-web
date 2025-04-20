import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../utils/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [hangmanHistory, setHangmanHistory] = useState([]);
  const [scrambleHistory, setScrambleHistory] = useState([]);

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
                <table className="table table-bordered table-sm mt-3 bg-white text-dark">
                  <thead className="table-light">
                    <tr>
                      <th>Score</th>
                      <th>Total Questions</th>
                      <th>Question Type</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory
                      .sort((a, b) => b.score - a.score)
                      .map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.score}</td>
                          <td>{entry.total}</td>
                          <td>{entry.type}</td>
                          <td>{entry.category}</td>
                          <td>{entry.difficulty}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Hangman Game Card */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Hangman</h5>
                <table className="table table-bordered table-sm mt-3 bg-white text-dark">
                  <thead className="table-light">
                    <tr>
                      <th>Total Wins</th>
                      <th>Total Rounds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hangmanHistory
                      .sort(
                        (a, b) => b.corrected_questions - a.corrected_questions
                      )
                      .map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.corrected_questions}</td>
                          <td>{entry.total_questions}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Word Scramble Game Card */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Word Scramble</h5>
                <table className="table table-bordered table-sm mt-3 bg-white text-dark">
                  <thead className="table-light">
                    <tr>
                      <th>Total Wins</th>
                      <th>Total Rounds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scrambleHistory
                      .sort(
                        (a, b) => b.corrected_questions - a.corrected_questions
                      )
                      .map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.corrected_questions}</td>
                          <td>{entry.total_questions}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
