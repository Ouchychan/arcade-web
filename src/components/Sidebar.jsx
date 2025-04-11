import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ width: '200px', background: '#eee', height: '100vh', padding: '20px' }}>
      <nav>
        <Link to="/play">Play</Link><br />
        <Link to="/profile">Profile</Link><br />
        <button onClick={handleLogout}>Sign Out</button>
      </nav>
    </div>
  );
}
