import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/entry.css";

import useProfile from "../hooks/useProfile";
function MyEntry() {
  const [contests, setContests] = useState([]);
  const [wallet, setWallet] = useState(0);
const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { photo } = useProfile();

  const navigate = useNavigate();
const handleContestClick = async (contest) => {
  try {
    const res = await API.get(
      `/results/attempted/${contest.test._id}`
    );

    if (res.data.attempted) {
      // ✅ Already attempted → leaderboard
      navigate(
  `/leaderboard/${contest.test._id}?contest=${contest._id}`
);

    } else {
      // ❌ Not attempted → contest page
      navigate(`/contest/${contest._id}`);
    }
  } catch (err) {
    alert("Something went wrong");
  }
};
useEffect(() => {
  const loadData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      const walletRes = await API.get("/wallet");
      const contestRes = await API.get("/contests");

      setUser(userRes.data);
      setWallet(walletRes.data.balance);
      setContests(contestRes.data);
    } catch {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);


  const userMongoId = user?._id;

const joinedContests = contests.filter((contest) =>
  contest.joinedUsers?.some(
    (u) => u.toString() === userMongoId
  )
);




  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="screen">
      {/* HEADER */}
      <header>
        <div className="profile">
          <div className="photo-sect"
          onClick={() => navigate("/Profile")}
          style={{ cursor: "pointer" }}>
            <img
             src={photo} alt="Profile"
            /></div><div className="profile-info">
      <h2>{user?.fullName}</h2>
      <p>ID: {user?.userId}</p>
            </div>
          
        </div>

       <div className="wallet" onClick={() => navigate("/wallet")}>
  🪙 {wallet} 
</div>

      </header>

      {/* TAB HEADER */}
      <div className="title-row">
        <div className="row-item"
         onClick={() => navigate("/entry")}>ENTRY</div>
        <div
          className="row-item"
         
        >
          MY ENTRY
        </div>
      </div>


      {joinedContests.length === 0 ? (
  <p>You have not joined any contests yet.</p>
) : (
  <div className="entry-list">
    {joinedContests.map((contest) => (
      <div
        key={contest._id}
        className="entry-card"
        onClick={() => handleContestClick(contest)}
      >
        <div className="entry-left">
          <span>₹{contest.entryFee}</span>
          <span>Prize ₹{contest.prizePool}</span>
        </div>

        <div className="entry-right">
          {contest.attempted ? "Completed" : "Ongoing"}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
    
  );
}

export default MyEntry;
