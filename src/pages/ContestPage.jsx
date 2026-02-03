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
    <div className="contest-screen">

      {/* BACK */}
      <i
        className="material-icons back"
        onClick={() => navigate("/entry")}
      >
        arrow_back
      </i>

      {/* TABS */}
      <div className="contest-tabs">
        <div className="tab active">CONTEST</div>
        <div
          className="tab"
          onClick={() =>
            navigate(`/leaderboard/${contest.test._id}?contest=${contest._id}`)
          }
        >
          LEADERBOARD
        </div>
        <div
          className="tab"
          onClick={() => navigate(`/my-test/${contestId}`)}
        >
          MY TEST
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="contest-card">

        {/* TOP INFO */}
        <div className="top-info">
          <div className="info">
            ⏱ Duration: {contest.test.duration} mins
          </div>
          <div className="info">
            ⭐ Max Marks: {contest.test.questions.length}
          </div>
        </div>

        {/* RULES */}
        <ul className="rules">
          <li>Total questions: {contest.test.questions.length}</li>
          <li>Each question has 4 options</li>
          <li>+1 for correct answer</li>
          <li>No negative marking</li>
          <li>🔒 Test can be attempted only once</li>
        </ul>
      </div>

      {/* ERROR / INFO BAR */}
      {attempted && (
        <div className="error-box">
          ❌ Test already attempted — check leaderboard
        </div>
      )}
    </div>
  );
}

export default ContestPage;