
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function PlayPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '20px' }}>
        <h2>Select a Game</h2>
        <ul>
          <li><Link to="/game1">Game 1</Link></li>
          <li><Link to="/game2">Game 2</Link></li>
          <li><Link to="/game3">Game 3</Link></li>
        </ul>
      </div>
    </div>
  );
}
