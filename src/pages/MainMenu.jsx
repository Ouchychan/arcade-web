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
            "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/quiz_scores"
          ).then((res) => res.json()),
          fetch(
            "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/hangman_scores"
          ).then((res) => res.json()),
          fetch(
            "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/scramble_scores"
          ).then((res) => res.json()),
        ]);

        const formatScores = (data, scoreKey, totalKey) =>
          data
            .map((score) => ({
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
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Score (%)</th>
              <th>Correct / Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.score.toFixed(2)}%</td>
                <td>
                  {score.corrected} / {score.total}
                </td>
                <td>{new Date(score.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Container fluid className="py-4 px-5">
        <Row>
          <Col>
            <h2 className="mb-4">🎉 Welcome to the Arcade!</h2>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Ready to Play?</Card.Title>
                <Card.Text>
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
