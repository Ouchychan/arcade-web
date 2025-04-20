import { useState } from "react";
import { Modal, Button, Form, Nav, Fade } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function HomePage() {
  const { login, signUp, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        alert("✅ Login successful!");
        navigate("/main");
      } else {
        // Sign-up logic without saving the token
        await signUp(email, password);
        alert("✅ Sign-up successful! Please log in.");
        setIsLogin(true); // Switch to login after signup
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const token = await googleLogin();
      localStorage.setItem("token", token); // Save JWT in localStorage
      alert("✅ Google login successful!");
      navigate("/main");
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <h1 className="mb-4">🎮 Welcome to Arcade Web 🎮</h1>
      <Button
        variant="warning"
        onClick={() => setShowModal(true)}
        className="px-4 py-2 fs-5"
      >
        Login / Sign Up
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant={isLogin ? "warning" : "success"}
                  className="w-100 mb-2"
                >
                  {isLogin ? "Log In" : "Sign Up"}
                </Button>

                <div className="text-center">or</div>

                <Button
                  variant="danger"
                  className="w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <i className="bi bi-google" />
                  Continue with Google
                </Button>
              </Form>
            </div>
          </Fade>
        </Modal.Body>
      </Modal>
    </div>
  );
}
