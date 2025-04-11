import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainMenu from './pages/MainMenu';
import PlayPage from './pages/PlayPage';
import ProfilePage from './pages/ProfilePage';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/main" element={<MainMenu />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
          <Route path="/game3" element={<Game3 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
