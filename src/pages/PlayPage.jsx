import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card } from "react-bootstrap";

export default function PlayPage() {
  const games = [
    {
      title: "Quiz Game",
      path: "/game1",
      description:
        "Test your knowledge across various categories and difficulties.",
    },
    {
      title: "Hangman",
      path: "/game2",
      description:
        "Guess the word one letter at a time before the figure is complete!",
    },
    {
      title: "Scramble",
      path: "/game3",
      description: "Unscramble the shuffled letters to find the correct word.",
    },
  ];

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f49fbc" }}
    >
      <Sidebar />
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center fw-bold mb-5" style={{ color: "#880e4f" }}>
          Select a Game
        </h2>
        <div className="row w-100 justify-content-center">
          {games.map((game, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <Link to={game.path} style={{ textDecoration: "none" }}>
                <Card className="game-card text-white h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title className="fs-3 text-center">
                      {game.title}
                    </Card.Title>
                    <Card.Text className="text-center">
                      {game.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
