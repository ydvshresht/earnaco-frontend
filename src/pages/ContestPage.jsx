import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/contest.css";

function ContestPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [user, setUser] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [coins, setCoins] = useState(0);

  /* =====================
     LOAD USER + CONTEST + WALLET
  ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        const walletRes = await API.get("/wallet");
        setCoins(walletRes.data.coins);

        const contestRes = await API.get(`/contests/${contestId}`);
        setContest(contestRes.data);

        const attemptRes = await API.get(
          `/results/attempted/${contestRes.data.test._id}`
        );
        setAttempted(attemptRes.data.attempted);
      } catch (err) {
        alert("Failed to load contest");
        navigate("/entry");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contestId, navigate]);

  if (loading) return <h3>Loading...</h3>;
  if (!contest || !contest.test || !user) return null;

  const alreadyJoined = contest.joinedUsers.some(
    (u) => u.toString() === user._id
  );

  /* =====================
     BUY CONTEST (COINS)
  ===================== */
  const buyContest = async () => {
    if (!agree) {
      alert("Please agree to instructions");
      return;
    }

    try {
      setBuying(true);

      await API.post(`/contests/buy/${contestId}`);

      // 🔄 Refresh contest & wallet
      const updatedContest = await API.get(`/contests/${contestId}`);
      const updatedWallet = await API.get("/wallet");

      setContest(updatedContest.data);
      setCoins(updatedWallet.data.coins);

      alert(`Contest unlocked 🎉\n${contest.entryFee} coins deducted`);
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Not enough coins to join contest"
      );
    } finally {
      setBuying(false);
    }
  };

  /* =====================
     NAVIGATION
  ===================== */
  const startTest = () => {
    console.log("Navigating to test:", contest.test._id, contest._id);
    navigate(`/test/${contest.test._id}?contest=${contest._id}`);
  };

  const goToLeaderboard = () => {
    navigate(`/leaderboard/${contest.test._id}?contest=${contest._id}`);
  };

  const goToMyTest = () => {
    navigate("/my-test");
  };

  return (
    <div className="screen">
      {/* BACK */}
      <i
        className="material-icons"
        onClick={() => navigate("/entry")}
        style={{ cursor: "pointer" }}
      >
        arrow_back
      </i>

      {/* HEADER */}
      <div className="coupon-header">
        <div className="header-item">CONTEST</div>
        <div className="header-item" onClick={goToLeaderboard}>
          LEADERBOARD
        </div>
        <div className="header-item" onClick={goToMyTest}>
          MY TEST
        </div>
      </div>

      {/* TEST DETAILS */}
      <div className="test-container">
        <div className="test-details">
          <span>Duration: {contest.test.duration} mins</span>
          <span>
            Maximum Marks: {contest.test.questions.length}
          </span>
        </div>

        <ul className="instructions">
          <li>Total questions: {contest.test.questions.length}</li>
          <li>Each question has 4 options</li>
          <li>+1 for correct answer</li>
          <li>No negative marking</li>
          <li>Test can be attempted only once</li>
        </ul>

        <div className="bottom-section">
          <label>Choose Language:</label>
          <select>
            <option>English</option>
            <option>Hindi</option>
          </select>

          {/* ❌ NOT JOINED */}
          {!alreadyJoined && (
            <button
              className="agree-btn"
              disabled={!agree || buying}
              onClick={buyContest}
            >
              {buying
                ? "Unlocking..."
                : `Unlock Contest 🪙 ${contest.entryFee} Coins`}
            </button>
          )}

          {/* ✅ JOINED BUT NOT ATTEMPTED */}
          {alreadyJoined && !attempted && (
            <button
              className="agree-btn"
              onClick={startTest}
            >
              Start Test 🚀
            </button>
          )}

          {/* 🛑 ALREADY ATTEMPTED */}
          {alreadyJoined && attempted && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Test already attempted — check leaderboard
            </p>
          )}

          {/* AGREEMENT */}
          {!alreadyJoined && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />{" "}
              I agree to instructions
            </div>
          )}

          {/* WALLET INFO */}
          <p style={{ marginTop: "12px", opacity: 0.7 }}>
            🪙 Your Coins: <b>{coins}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContestPage;
