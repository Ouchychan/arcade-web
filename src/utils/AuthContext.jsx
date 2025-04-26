import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext({
  login: () => {},
  signUp: () => {},
  logout: () => {},
  googleLogin: () => {},
  currentUser: null,
  username: "",
  user_email: "",
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  // Email/password login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Email/password sign up
  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = () => signOut(auth);

  // Google login
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      throw new Error("Google sign-in failed");
    }
  };

  // Track user auth state and fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles/${encodeURIComponent(
              user.email
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          setUsername(data.username); // Backend returns { data: { username, user_email } }
          setUserEmail(data.user_email);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUsername("");
        setUserEmail("");
      }
      setCurrentUser(user);
      setLoading(false); // Stop loading once the user state is set
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signUp,
        logout,
        googleLogin,
        username,
        userEmail,
      }}
    >
      {!loading && children} {/* Only render children when loading is done */}
    </AuthContext.Provider>
  );
};

// Export useAuth hook
export const useAuth = () => useContext(AuthContext);

// ProtectedRoute component
export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate("/"); // Redirect to login if user is not authenticated
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
};
