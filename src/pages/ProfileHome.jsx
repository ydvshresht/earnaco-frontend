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
      <div className="profile-top">
        <i
          className="material-icons"
          onClick={() => navigate("/entry")}
        >
          arrow_back
        </i>
        <span>Profile</span>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <img src={photo} alt="profile" className="avatar" />

      <div className="userd" > <h4>{user?.fullName}</h4>
        <p>ID: {user?.userId}</p></div>

        <div
          className="coin-badge"
          onClick={() => navigate("/wallet")}
        >
          🪙 {coins}
        </div>
      </div>

      {/* MENU */}
      <div className="profile-menu">

        <div
          className="menu-item"
          onClick={() => navigate("/profile/details")}
        >
          <i className="material-icons">person</i>
          Personal Details
          <span>›</span>
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/my-entry")}
        >
          <i className="material-icons">assignment</i>
          My Contest
          <span>›</span>
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/refer")}
        >
          <i className="material-icons">group_add</i>
          Refer & Earn
          <span>›</span>
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/support")}
        >
          <i className="material-icons">support_agent</i>
          Customer Support
          <span>›</span>
        </div>

        {user?.role === "admin" && (
          <div
            className="menu-item admin"
            onClick={() => navigate("/admin")}
          >
            <i className="material-icons">
              admin_panel_settings
            </i>
            Admin Panel
            <span>›</span>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default ProfileHome;
