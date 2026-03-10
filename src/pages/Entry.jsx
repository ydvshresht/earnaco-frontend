import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/entry.css";
import useProfile from "../hooks/useProfile";

function Entry() {
  const [contests, setContests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);
const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { photo } = useProfile();

 useEffect(() => {
  const loadData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      setUser(userRes.data);

      const walletRes = await API.get("/wallet");
      setCoins(walletRes.data.coins);

      const contestRes = await API.get("/contests");
      setContests(contestRes.data);

    } catch (err) {
      console.error("ENTRY PAGE ERROR:", err);
      navigate("/");
    }
  };

  loadData();
}, [navigate]);

// ✅ MOVE HERE
const filteredContests = contests.filter((contest) =>
  contest.test?.testName
    ?.toLowerCase()
    .includes(search.toLowerCase())
);

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
     {/* 🔍 SEARCH BAR */}
<div className="search-container">
  <span className="search-icon">🔍</span>

  <input
    type="text"
    placeholder="Search test or contest..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {search && (
    <span
      className="clear-btn"
      onClick={() => setSearch("")}
    >
      ✖
    </span>
  )}
</div>
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
  {filteredContests.length === 0 ? (
    <p className="no-result">No contests found.</p>
  ) : (
    filteredContests.map((contest) => (
      <div
        key={contest._id}
        className="entry-card"
        onClick={() => navigate(`/contest/${contest._id}`)}
      >
        <div className="entry-left">
          <span>{contest.test?.testName}</span>
          <span>🪙 {contest.entryFee}</span>
         
        </div>

        <div className="entry-right">
          <span>🏆 {contest.prizePool} Coins</span>
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
}

export default Entry;
