import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/myentry.css";
import useProfile from "../hooks/useProfile";

function MyEntry() {
  const [contests, setContests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { photo } = useProfile();

  /* =====================
     HANDLE CONTEST CLICK
  ===================== */
  const handleContestClick = async (contest) => {
    try {
      const res = await API.get(
        `/results/attempted/${contest.test._id}`
      );

      if (res.data.attempted) {
        navigate(
          `/leaderboard/${contest.test._id}?contest=${contest._id}`
        );
      } else {
        navigate(`/contest/${contest._id}`);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        const walletRes = await API.get("/wallet");
        const contestRes = await API.get("/contests");

        setUser(userRes.data);
        setCoins(walletRes.data.coins);
        setContests(contestRes.data);
      } catch (err) {
        console.error("MY ENTRY ERROR:", err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  const userMongoId = user?._id;

  const joinedContests = contests.filter((contest) =>
    contest.joinedUsers?.some(
      (u) => u.toString() === userMongoId
    )
  );

 return (
    <div className="entry-screen">

      {/* HEADER */}
      <div className="profile-card">
        <div
          className="profile-left"
          onClick={() => navigate("/profile")}
        >
          <img src={photo} alt="profile" />
          <div>
            <h4>{user?.fullName}</h4>
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
      <div className="tabs">
        <div
          className="tab"
          onClick={() => navigate("/entry")}
        >
          ENTRY
        </div>
        <div className="tab active">MY ENTRY</div>
      </div>

      {/* CONTENT */}
      {joinedContests.length === 0 ? (
        <div className="empty">
          You have not joined any contests yet.
        </div>
      ) : (
        <div className="entry-list">
          {joinedContests.map(contest => (
            <div
              key={contest._id}
              className="entry-card"
              onClick={() => handleContestClick(contest)}
            >
              <div className="left">
                <span className="coin">
                  🪙 {contest.entryFee}
                </span>
                <span className="prize">
                  🏆 {contest.prizePool} Coins
                </span>
              </div>

              <div className="right">
                {contest.joinedUsers.length}/
                {contest.maxSpots}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEntry;