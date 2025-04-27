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
  user_id: "", // We will still store user_id in context for reference
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(""); // Still store userId for reference
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate(); // Add navigate here for navigation

  // Email/password login
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase automatically triggers the `onAuthStateChanged` after a successful login.
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Login failed");
    }
  };

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
          const userEmail = user.email; // Get the user email from Firebase (this is used to refer to the user in the backend)

          // Fetch user profile from the backend using user_email
          const res = await fetch(
            `https://04158105-ba5b-456c-b2b8-8b44449fbfd7-00-3aws21y02db6k.sisko.replit.dev/api/user_profiles/${userEmail}`, // API now refers to user_email
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            console.log(data);
            setUsername(data.username); // Set username from the response
            setUserEmail(data.user_email); // Set user_email from the response
            setUserId(data.id); // Set user_id from the response (from the database)
          } else {
            console.error("Error fetching user profile:", await res.json());
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUsername("");
        setUserEmail("");
        setUserId(""); // Clear user_id when logged out
      }
      setCurrentUser(user);
      setLoading(false); // Stop loading once the user state is set

      // Navigate to the main page after the user logs in or signs up
      if (user) {
        navigate("/main");
      }
    });

    return () => unsubscribe();
  }, [navigate]); // Add navigate to the dependency array

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
        userId, // Provided user_id in context
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
