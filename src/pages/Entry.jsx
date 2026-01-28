import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/entry.css";
import "../styles/body.css";
import useProfile from "../hooks/useProfile";

function Entry() {
  const [contests, setContests] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { photo } = useProfile();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        const walletRes = await API.get("/wallet");
        setWallet(walletRes.data.balance);

        const contestRes = await API.get("/contests");
        console.log("CONTESTS:", contestRes.data);
        setContests(contestRes.data);
      } catch {
         console.error("ENTRY PAGE ERROR:", err.response || err);
        navigate("/");
      }
    };

    loadData();
  }, []);

  return (<div id="app">
    <div className="page">
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

        <div className="wallet" onClick={() => navigate("/wallet")}>
          <i className="material-icons">account_balance_wallet</i>₹{wallet}
        </div>
      </header>

      {/* TAB HEADER */}
      <div className="title-row">
        <div className="row-item">ENTRY</div>
        <div className="row-item" onClick={() => navigate("/my-entry")}>
          MY ENTRY
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
                <span>₹{contest.entryFee}</span>
                <span>{contest.prizePool} Prize</span>
              </div>

              <div className="entry-right">
                {contest.joinedUsers?.length || 0}/{contest.maxSpots}
              </div>
            </div>
          ))
        )}
      </div>
    </div></div>
  );
}

export default Entry;
