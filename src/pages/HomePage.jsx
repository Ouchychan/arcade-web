import { useState } from "react";
import { Modal, Button, Form, Nav, Fade } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

export default function HomePage() {
  const { login, signUp, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);

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
        1;
        await signUp(email, password);
        toast.success("✅ Sign-up successful!");

        // Save to user_profiles table
        const res = await fetch(
          "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles",
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
      await googleLogin(); // Triggers popup login
      const user = auth.currentUser;

      if (!user) throw new Error("User not found after Google login.");

      const email = user.email;
      const username = user.displayName;
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      toast.success("✅ Google login successful!");

      // Save profile
      const res = await fetch(
        "https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles",
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

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                )}

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
