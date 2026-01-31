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

  /* =====================
     LOAD DATA
  ===================== */
  const loadData = async () => {
  try {
    const userRes = await API.get("/auth/me");
    setUser(userRes.data);

    const contestRes = await API.get(`/contests/${contestId}`);
    setContest(contestRes.data);

    const attemptRes = await API.get(
      `/results/attempted/${contestId}`
    );
    setAttempted(attemptRes.data.attempted);

  } catch (err) {
    console.error("ContestPage error:", err.response?.data || err);
    alert("Failed to load contest");
    navigate("/entry");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadData();
  }, [contestId]);

  if (loading) return <h3>Loading...</h3>;
  if (!contest || !contest.test || !user) return null;

 const alreadyJoined = contest.joinedUsers.some(
  (id) => id === user._id || id?.toString() === user._id
);


  /* =====================
     JOIN CONTEST
  ===================== */
  const joinContest = async () => {
    if (!agree) {
      alert("Please agree to instructions");
      return;
    }

    try {
      setBuying(true);

      await API.post(`/contests/join/${contestId}`);

      // 🔄 reload everything from backend (single source of truth)
      await loadData();

      alert(`Contest unlocked 🎉`);

    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Unable to join contest"
      );
    } finally {
      setBuying(false);
    }
  };

  /* =====================
     START TEST (SAFE)
  ===================== */
  const startTest = async () => {
    try {
      const res = await API.get(`/contests/can-start/${contestId}`);
      if (!res.data.allowed) {
        alert("You are not allowed to start this test");
        return;
      }

      navigate(`/test/${contest.test._id}?contest=${contest._id}`);
    } catch {
      alert("Access denied");
    }
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
        <div
          className="header-item"
          onClick={() =>
            navigate(`/leaderboard/${contest.test._id}?contest=${contest._id}`)
          }
        >
          LEADERBOARD
        </div>
        <div
          className="header-item"
          onClick={() => navigate("/my-test")}
        >
          MY TEST
        </div>
      </div>

      {/* DETAILS */}
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

        {/* ACTIONS */}
        <div className="bottom-section">

          {!alreadyJoined && (
            <>
              <button
                className="agree-btn"
                disabled={!agree || buying}
                onClick={joinContest}
              >
                {buying
                  ? "Unlocking..."
                  : `Unlock Contest 🪙 ${contest.entryFee} Coins`}
              </button>

              <div style={{ marginTop: 10 }}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />{" "}
                I agree to instructions
              </div>
            </>
          )}

          {alreadyJoined && !attempted && (
            <button className="agree-btn" onClick={startTest}>
              Start Test 🚀
            </button>
          )}

          {alreadyJoined && attempted && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Test already attempted — check leaderboard
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestPage;
