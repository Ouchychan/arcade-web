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
  user_id: "",
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Email/password login
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main");
      setLoading(false);
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Login failed");
    }
  };

  // Email/password sign up
  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = async () => {
    try {
      await signOut(auth); // Firebase logout
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
    } catch (err) {
      console.error("Logout failed:", err);
      throw new Error("Logout failed");
    }
  };

  // Google login
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/main");
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Google sign-in failed");
    }
  };

  // Track user auth state and fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userEmail = user.email;

          // Fetch user profile from the backend using user_email
          const res = await fetch(
            `https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/user_profiles/${userEmail}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            setUsername(data.username);
            setUserEmail(data.user_email);
            setUserId(data.id);

            localStorage.setItem("username", data.username);
            localStorage.setItem("userEmail", data.user_email);
            localStorage.setItem("userId", data.id);
          } else {
            console.error("Error fetching user profile:", await res.json());
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUsername("");
        setUserEmail("");
        setUserId("");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
      }

      setCurrentUser(user);

      setLoading(false);

      if (user && window.location.pathname === "/") {
        navigate("/main");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
        userId,
      }}
    >
      {/* Only render the children when loading is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook
export const useAuth = () => useContext(AuthContext);

// ProtectedRoute component
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser === null) {
      navigate("/"); // Redirect to login if user is not authenticated
    }
  }, [currentUser, loading, navigate]);

  return !loading && currentUser ? children : null; // Render children only when loading is complete and user is authenticated
};
