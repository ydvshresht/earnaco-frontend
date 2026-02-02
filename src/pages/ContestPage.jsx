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
  const [startedOnce, setStartedOnce] = useState(false);

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

    // 🔥 if attempted, clear started flag
    if (attemptRes.data.attempted) {
      sessionStorage.removeItem(`started-${contestId}`);
      setStartedOnce(false);
    }

  } catch {
    alert("Failed to load contest");
    navigate("/entry");
  } finally {
    setLoading(false);
  }
};


  /* restore started state */
  useEffect(() => {
    const started = sessionStorage.getItem(
      `started-${contestId}`
    );
    if (started === "true") {
      setStartedOnce(true);
    }
  }, [contestId]);

  useEffect(() => {
    loadData();
  }, [contestId]);

  if (loading) return <h3>Loading...</h3>;
  if (!contest || !contest.test || !user) return null;

  const alreadyJoined = contest.joinedUsers.some(
    (id) => id.toString() === user._id
  );

  /* =====================
     JOIN CONTEST
  ===================== */
  const joinContest = async () => {
    if (!agree) return alert("Please agree to instructions");

    try {
      setBuying(true);
      await API.post(`/contests/join/${contestId}`);
      await loadData();
      alert("Contest unlocked 🎉");
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to join contest");
    } finally {
      setBuying(false);
    }
  };

  /* =====================
     START TEST
  ===================== */
  const startTest = async () => {
    try {
      const res = await API.get(`/contests/can-start/${contestId}`);
      if (!res.data.allowed) return alert("Not allowed");

      sessionStorage.setItem(
        `started-${contestId}`,
        "true"
      );

      setStartedOnce(true);
      navigate(`/test/${contest.test._id}?contest=${contest._id}`);
    } catch {
      alert("Access denied");
    }
  };

  return (
    <div className="screen">
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
        <div className="bottom-section">

          {/* NOT JOINED */}
          {!alreadyJoined && (
            <>
              <button
                className="agree-btn"
                disabled={!agree || buying}
                onClick={joinContest}
              >
                {buying
                  ? "Unlocking..."
                  : `Unlock 🪙 ${contest.entryFee}`}
              </button>

              <label>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                /> I agree to instructions
              </label>
            </>
          )}

          {/* START */}
          {alreadyJoined && !attempted && !startedOnce && (
            <button className="agree-btn" onClick={startTest}>
              Start Test 🚀
            </button>
          )}

          {/* IN PROGRESS */}
          {alreadyJoined && !attempted && startedOnce && (
            <p style={{ color: "#ff9800", fontWeight: "bold" }}>
              ⏳ Test in progress — do not refresh
            </p>
          )}

          {/* ATTEMPTED */}
          {alreadyJoined && attempted && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ❌ Test already attempted — check leaderboard
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default ContestPage;
