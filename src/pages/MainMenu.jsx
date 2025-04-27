import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";

export default function MainMenu() {
  const [quizScores, setQuizScores] = useState([]);
  const [hangmanScores, setHangmanScores] = useState([]);
  const [scrambleScores, setScrambleScores] = useState([]);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const [quizRes, hangmanRes, scrambleRes] = await Promise.all([
          fetch(
            "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/quiz_scores"
          ).then((res) => res.json()),
          fetch(
            "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/hangman_scores"
          ).then((res) => res.json()),
          fetch(
            "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/scramble_scores"
          ).then((res) => res.json()),
        ]);

        const formatScores = (data, scoreKey, totalKey) =>
          data
            .map((score) => ({
              username: score.username,
              score: (score[scoreKey] / score[totalKey]) * 100,
              corrected: score[scoreKey],
              total: score[totalKey],
              created_at: score.created_at,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Top 5

        setQuizScores(formatScores(quizRes, "score", "total"));
        setHangmanScores(
          formatScores(hangmanRes, "corrected_questions", "total_questions")
        );
        setScrambleScores(
          formatScores(scrambleRes, "corrected_questions", "total_questions")
        );
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchHighScores();
  }, []);

  const renderScoreTable = (label, scores) => (
    <div className="mb-5">
      <h4 className="mb-3">{label}</h4>
      {scores.length === 0 ? (
        <Alert variant="info">No records yet. Be the first to play!</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Score (%)</th>
                <th>Correct / Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score.username || "Unknown"}</td>
                  <td>{score.score.toFixed(2)}%</td>
                  <td>
                    {score.corrected} / {score.total}
                  </td>
                  <td>{new Date(score.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
      <Sidebar />

      <Container fluid className="py-4 px-3 px-md-5 flex-grow-1">
        <Row>
          <Col>
            <h2 className="mb-4 text-center text-md-start">
              🎉 Welcome to the Arcade!
            </h2>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="fs-4 text-center text-md-start">
                  Ready to Play?
                </Card.Title>
                <Card.Text className="text-center text-md-start">
                  Explore our collection of mini-games by clicking the{" "}
                  <strong>Play</strong> button in the sidebar.
                  <br />
                  Challenge yourself and set a new high score!
                </Card.Text>
              </Card.Body>
            </Card>

            {renderScoreTable("🏆 Quiz Master", quizScores)}
            {renderScoreTable("🎯 Hangman Hero", hangmanScores)}
            {renderScoreTable("🔤 Word Scramble", scrambleScores)}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
