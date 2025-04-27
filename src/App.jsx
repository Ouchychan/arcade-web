import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import { ProtectedRoute } from "./utils/AuthContext";
import { ToastContainer } from "react-toastify";

import HomePage from "./pages/HomePage";
import MainMenu from "./pages/MainMenu";
import PlayPage from "./pages/PlayPage";
import ProfilePage from "./pages/ProfilePage";
import Game1 from "./pages/Game1";
import Game2 from "./pages/Game2";
import Game3 from "./pages/Game3";

import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

function App() {
  return (
    <Router>
      {" "}
      {/* Router should wrap everything first */}
      <AuthProvider>
        {" "}
        {/* AuthProvider inside Router */}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <PlayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game1"
            element={
              <ProtectedRoute>
                <Game1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game2"
            element={
              <ProtectedRoute>
                <Game2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game3"
            element={
              <ProtectedRoute>
                <Game3 />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
