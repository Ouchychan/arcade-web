import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Nav,
  Fade,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function HomePage() {
  const { login, signUp, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [backgroundUrl, setBackgroundUrl] = useState("");

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, "arcadeWeb.jpg");
        const url = await getDownloadURL(storageRef);
        setBackgroundUrl(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("✅ Login successful!");
        navigate("/main");
      } else {
        if (!username.trim()) {
          toast.error("❌ Username is required.");
          return;
        }
        await signUp(email, password);
        toast.success("✅ Sign-up successful!");

        const res = await fetch(
          "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/user_profiles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_email: email, username }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save profile.");
        }

        toast.success("✅ Profile saved! Please log in.");
        setIsLogin(true);
      }
      setShowModal(false);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      await googleLogin();
      const user = auth.currentUser;

      if (!user) throw new Error("User not found after Google login.");

      const email = user.email;
      const username = user.displayName;
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      toast.success("✅ Google login successful!");

      const res = await fetch(
        "https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/user_profiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_email: email, username }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save Google profile.");
      }

      navigate("/main");
      setShowModal(false);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  return (
    <div
      className="position-relative d-flex flex-column justify-content-center align-items-center min-vh-100 text-white p-3"
      style={{
        backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="mb-4 display-4 fw-bold">🎮 Arcade Web 🎮</h1>
            <p className="mb-4 fs-5">
              Play fun games anytime, anywhere! Start gaming by logging in or
              signing up!
            </p>
            <Button
              variant="warning"
              onClick={() => setShowModal(true)}
              className="px-5 py-3 fs-5"
            >
              Login / Sign Up
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton className="border-0">
          <Nav variant="tabs" className="w-100">
            <Nav.Item className="w-50 text-center">
              <Nav.Link
                eventKey="login"
                active={isLogin}
                onClick={() => setIsLogin(true)}
                className="d-flex justify-content-center align-items-center gap-2"
              >
                <i className="bi bi-box-arrow-in-right"></i> Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="w-50 text-center">
              <Nav.Link
                eventKey="signup"
                active={!isLogin}
                onClick={() => setIsLogin(false)}
                className="d-flex justify-content-center align-items-center gap-2"
              >
                <i className="bi bi-person-plus"></i> Sign Up
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Header>

        <Modal.Body>
          <Fade in={true}>
            <div key={isLogin ? "login" : "signup"}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                    />
                  </Form.Group>
                )}

                <Button
                  type="submit"
                  variant={isLogin ? "warning" : "success"}
                  className="w-100 mb-3 py-2"
                >
                  {isLogin ? "Log In" : "Sign Up"}
                </Button>

                <div className="text-center mb-2 text-muted">or</div>

                <Button
                  variant="danger"
                  className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                  onClick={handleGoogleLogin}
                >
                  <i className="bi bi-google"></i> Continue with Google
                </Button>
              </Form>
            </div>
          </Fade>
        </Modal.Body>
      </Modal>

      {/* Showcase games */}
      <Container className="mt-5">
        <Fade in={true} appear={true} timeout={500}>
          <Row className="g-4">
            <Col md={4}>
              <div
                className="card h-100 shadow-lg bg-dark text-white"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">🧠 Quiz Game</h5>
                  <p className="card-text flex-grow-1">
                    Test your knowledge across multiple categories and
                    difficulties. How many questions can you get right?
                  </p>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div
                className="card h-100 shadow-lg bg-dark text-white"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">🎯 Hangman</h5>
                  <p className="card-text flex-grow-1">
                    Guess the hidden word before the hangman is complete! Choose
                    your letters wisely.
                  </p>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div
                className="card h-100 shadow-lg bg-dark text-white"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">🔀 Word Scramble</h5>
                  <p className="card-text flex-grow-1">
                    Unscramble the letters to find the correct word. Challenge
                    your brain with tricky puzzles!
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Fade>
      </Container>
    </div>
  );
}
