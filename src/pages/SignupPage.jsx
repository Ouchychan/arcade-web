import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function LoginPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = () => {
    signUp();
    navigate('/login');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
