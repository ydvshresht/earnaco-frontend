import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import useProfile from "../hooks/useProfile";
import "../styles/profileHome.css";
import "../styles/body.css";

function ProfileHome() {
  const navigate = useNavigate();

  const { photo } = useProfile();
  const [wallet, setWallet] = useState(0);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        const walletRes = await API.get("/wallet");

        setUser(userRes.data);
        setWallet(walletRes.data.balance);
      } catch {
        alert("Session expired");
        handleLogout();
      }
    };

    loadData();
  }, []);

  return (<div id="app">
    <div className="page">
      <div className="icon-text">
<i className="material-icons" onClick={() => navigate("/entry")}>arrow_back</i>Profile
</div>
      <div className="profile-header">
        <img className="profile-pic" src={photo} alt="Profile" />
        <h5>{user?.fullName}</h5>

        <div className="wallet" onClick={() => navigate("/wallet")}>
          <i className="material-icons">account_balance_wallet</i>₹{wallet}
          </div>
      </div>

      <div className="menu">
        <div className="menu-item" onClick={() => navigate("/Profile/Details")}>
          <i className="material-icons">person</i>Personal Detail
        </div>

        <div className="menu-item" onClick={() => navigate("/my-entry")}>
          <i className="material-icons">credit_card</i>
 My Entry
        </div>

        <div className="menu-item" onClick={() => navigate("/bank-autopay")}>
          <i className="material-icons">account_balance</i>
 Bank & Autopay
        </div>

        <div className="menu-item" onClick={() => navigate("/refer")}>
          <i className="material-icons">group_add</i>
 Refer & Earn
        </div>

        <div className="menu-item" onClick={() => navigate("/support")}>
          <i className="material-icons">support_agent</i>
 Customer Support
        </div>

        {/* ✅ ADMIN PANEL */}
        {user?.role === "admin" && (
          <div
            className="menu-item admin"
            onClick={() => navigate("/admin")}
          >
            <i className="material-icons">admin_panel_settings</i>
 Admin Panel
          </div>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div></div>
  );
}

export default ProfileHome;
