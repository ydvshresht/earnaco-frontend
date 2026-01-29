import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import useProfile from "../hooks/useProfile";
import "../styles/profileHome.css";

function ProfileHome() {
  const navigate = useNavigate();
  const { photo } = useProfile();

  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);

  /* =====================
     LOGOUT
  ===================== */
  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  /* =====================
     LOAD USER + COINS
  ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        const walletRes = await API.get("/wallet");

        setUser(userRes.data);
        setCoins(walletRes.data.coins);
      } catch {
        alert("Session expired");
        handleLogout();
      }
    };

    loadData();
  }, []);

  return (
    <div className="screen">
      {/* HEADER */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/entry")}
        >
          arrow_back
        </i>
        Profile
      </div>

      {/* PROFILE CARD */}
      <div className="profile-header">
        <img
          className="profile-pic"
          src={photo}
          alt="Profile"
        />

        <h5>{user?.fullName}</h5>
        <p className="user-id">ID: {user?.userId}</p>

        {/* COIN WALLET */}
        <div
          className="wallet"
          onClick={() => navigate("/wallet")}
        >
        
          🪙 {coins}
        </div>
      </div>

      {/* MENU */}
      <div className="menu">
        <div
          className="menu-item"
          onClick={() => navigate("/profile/details")}
        >
          <i className="material-icons">person</i>
          Personal Details
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/my-entry")}
        >
          <i className="material-icons">assignment</i>
          My Entry
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/refer")}
        >
          <i className="material-icons">group_add</i>
          Refer & Earn
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/support")}
        >
          <i className="material-icons">support_agent</i>
          Customer Support
        </div>

        {/* ADMIN PANEL */}
        {user?.role === "admin" && (
          <div
            className="menu-item admin"
            onClick={() => navigate("/admin")}
          >
            <i className="material-icons">
              admin_panel_settings
            </i>
            Admin Panel
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileHome;
