import Sidebar from '../components/Sidebar';

export default function ProfilePage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '20px' }}>
        <h2>Your Profile</h2>
        <p>Username: DemoUser</p>
        <p>Games Played: 0 (mock data)</p>
      </div>
    </div>
  );
}
