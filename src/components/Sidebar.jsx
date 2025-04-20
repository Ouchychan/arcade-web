import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { FaHome, FaPlay, FaUser } from "react-icons/fa"; // Added FaHome
import { useState } from "react";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoutConfirmation = () => {
    setShowConfirm(true);
  };

  const confirmLogout = (confirm) => {
    if (confirm) {
      handleLogout();
    }
    setShowConfirm(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={sidebarStyles}>
      <nav>
        <Link to="/main" style={linkStyles(isActive("/main"))}>
          <FaHome style={iconStyles} />
          <span style={textStyles}>Main Menu</span>
        </Link>

        <Link to="/play" style={linkStyles(isActive("/play"))}>
          <FaPlay style={iconStyles} />
          <span style={textStyles}>Play</span>
        </Link>

        <Link to="/profile" style={linkStyles(isActive("/profile"))}>
          <FaUser style={iconStyles} />
          <span style={textStyles}>Profile</span>
        </Link>

        <button style={logoutButtonStyles} onClick={handleLogoutConfirmation}>
          Sign Out
        </button>
      </nav>

      {showConfirm && (
        <div style={confirmationStyles}>
          <p>Are you sure you want to log out?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => confirmLogout(true)}
              style={confirmButtonStyles}
            >
              Yes
            </button>
            <button
              onClick={() => confirmLogout(false)}
              style={cancelButtonStyles}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles (same as before)
const sidebarStyles = {
  width: "200px",
  background: "#00bcd4",
  height: "100vh",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.3s ease",
};

const linkStyles = (isActive) => ({
  display: "flex",
  alignItems: "center",
  color: isActive ? "white" : "darkblue",
  textDecoration: "none",
  marginBottom: "15px",
  padding: "10px 20px",
  borderRadius: "8px",
  backgroundColor: isActive ? "#007b8f" : "transparent",
  transition: "background 0.3s ease, transform 0.2s ease",
  boxShadow: isActive ? "inset 2px 2px 10px rgba(0,0,0,0.2)" : "none",
});

const iconStyles = {
  marginRight: "10px",
  fontSize: "1.5em",
};

const textStyles = {
  fontSize: "1.1em",
};

const logoutButtonStyles = {
  background: "transparent",
  color: "darkblue",
  border: "1px solid darkblue",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.2s ease",
};

const confirmationStyles = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const confirmButtonStyles = {
  background: "#00bcd4",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const cancelButtonStyles = {
  background: "gray",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
