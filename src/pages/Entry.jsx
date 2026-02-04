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
    <div className="screen">
      {/* HEADER */}
      <header>
        <div className="profile">
          <div
            className="photo-sect"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            <img src={photo} alt="Profile" />
          </div>

          <div className="profile-info">
            <h2>{user?.fullName}</h2>
            <p>ID: {user?.userId}</p>
          </div>
        </div>

        {/* 🪙 COINS */}
        <div className="wallet" onClick={() => navigate("/wallet")}>
          🪙 {coins}
        </div>
      </header>

      {/* TAB HEADER */}
      <div className="title-row">
        <div className="row-item active">CONTEST</div>
        <div
          className="row-item"
          onClick={() => navigate("/my-entry")}
        >
          MY CONTEST
        </div>
      </div>

      {/* ENTRY LIST */}
      <div className="entry-list">
        {contests.length === 0 ? (
          <p>No contests available.</p>
        ) : (
          contests.map((contest) => (
            <div
              key={contest._id}
              className="entry-card"
              onClick={() =>
                navigate(`/contest/${contest._id}`)
              }
            >
              <div className="entry-left">
                <span> {contest.test?.testName}</span>
                <span>🪙 {contest.entryFee}</span>
                <span>🏆 {contest.prizePool} Coins</span>
              </div>

              <div className="entry-right">
                {contest.joinedUsers?.length || 0}/{contest.maxSpots}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Entry;
