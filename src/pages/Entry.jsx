import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/entry.css";
import useProfile from "../hooks/useProfile";

function Entry() {
  const [contests, setContests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { photo } = useProfile();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 👤 USER
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        // 🪙 COINS
        const walletRes = await API.get("/wallet");
        setCoins(walletRes.data.coins);

        // 🏆 CONTESTS
        const contestRes = await API.get("/contests");
        setContests(contestRes.data);

      } catch (err) {
        console.error("ENTRY PAGE ERROR:", err);
        navigate("/");
      }
    };

    loadData();
  }, [navigate]);

   return (
    <div className="entry-screen">

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-left"
           onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}>
          <img src={photo} alt="profile" />
          <div>
            <h3>{user?.fullName}</h3>
            <p>ID: {user?.userId}</p>
          </div>
        </div>

        <div
          className="coin-box"
          onClick={() => navigate("/wallet")}
        >
          🪙 {coins}
        </div>
      </div>

      {/* TABS */}
      <div className="entry-tabs">
        <div className="tab active">ENTRY</div>
        <div
          className="tab"
          onClick={() => navigate("/my-entry")}
        >
          MY ENTRY
        </div>
      </div>

      {/* ENTRY LIST */}
      <div className="entry-list">
        {contests.length === 0 ? (
          <p className="empty">No contests available</p>
        ) : (
          contests.map(c => (
            <div
              key={c._id}
              className="contest-card"
              onClick={() =>
                navigate(`/contest/${c._id}`)
              }
            >
              <div className="contest-left">
                <span>{c.test?.testName}</span>
                <div className="coin-line">
                  🪙 {c.entryFee}
                </div>

                <div className="prize-line">
                  🏆 {c.prizePool} Coins
                </div>
              </div>

              <div className="contest-right">
                <span>
                  {c.joinedUsers?.length || 0}/{c.maxSpots}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Entry;
