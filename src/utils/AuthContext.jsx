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
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(""); // State for storing username

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

  // Fetch user profile (username) based on email after login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const res = await fetch(
            `https://af4103b4-8d83-4a81-ac80-46387965d272-00-98h4qksl1o0i.pike.replit.dev/api/user_profiles/${user.email}`
          );
          const data = await res.json();
          setUsername(data.username); // Set username after fetching from the backend
        } catch (err) {
          console.error("Error fetching username:", err);
        }
      } else {
        setUsername(""); // Reset username when no user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, username, login, signUp, logout, googleLogin }}
    >
      {children}
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
    if (!currentUser) {
      navigate("/"); // Redirect to login if user is not authenticated
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null; // Render children only if user is authenticated
};
