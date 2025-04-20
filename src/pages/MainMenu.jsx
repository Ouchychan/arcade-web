import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col, Card, Table } from "react-bootstrap";

export default function MainMenu() {
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
                  <strong> Play</strong> button in the sidebar.
                  <br />
                  Challenge yourself and set a new high score!
                </Card.Text>
              </Card.Body>
            </Card>

            <h4 className="mt-4 mb-3">🏆 High Scores</h4>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Game</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample placeholder rows */}
                <tr>
                  <td>1</td>
                  <td>Quiz Master</td>
                  <td>Alice</td>
                  <td>980</td>
                  <td>2025-04-20</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Hangman Hero</td>
                  <td>Bob</td>
                  <td>860</td>
                  <td>2025-04-19</td>
                </tr>
                {/* You can later map over dynamic score data here */}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
