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
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

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

  // Track user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signUp, logout, googleLogin }}
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
