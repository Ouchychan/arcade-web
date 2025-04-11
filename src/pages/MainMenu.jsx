import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainMenu() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '20px' }}>
        <h2>Welcome to the Arcade</h2>
        <p>Select a game from the left or click below:</p>
        <Link to="/play">Go to Play Page</Link>
      </div>
    </div>
  );
}
