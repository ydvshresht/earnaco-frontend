import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import "../styles/mytest.css";

function MyTest() {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!contestId) return;

    API.get(`/results/my-tests/${contestId}`)
      .then(res => setTests(res.data))
      .catch(() => alert("Failed to load results"));
  }, [contestId]);

  if (!tests.length) return <p className="empty">No Results</p>;

  const test = tests[0];
  const answers = Object.values(test.answers || []);
  const correct = answers.filter(a => a.status === "Right").length;

  return (
    <div className="result-screen">
      
      {/* 🔙 BACK ICON */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/entry")}
        >
          arrow_back
        </i>
      </div>

      {/* 🔝 HEADER TABS */}
      <div className="coupon-header">
        <div
          className="header-item"
          onClick={() => navigate(`/contest/${contestId}`)}
        >
          CONTEST
        </div>

        <div
          className="header-item"
          onClick={() => {
            if (!testId)
              return alert("Leaderboard not available");
            navigate(`/leaderboard/${testId}?contest=${contestId}`);
          }}
        >
          LEADERBOARD
        </div>

        <div className="header-item active">
          MY TEST
        </div>
      </div>
      <div className="result-card">

        <h1 className="title">RESULTS</h1>

        {/* USER */}
        <div className="user-box">
          <img src="/avatar.png" alt="user" />
          <div>
            <h3>Hello, Jane Doe!</h3>
            <p>(Peager is Heslingle)</p>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div><span>⏱</span> Time Taken <b>{test.timeTaken}s</b></div>
          <div><span>✅</span> Score <b>{correct}/{answers.length}</b></div>
          <div><span>🎯</span> Accuracy <b>100%</b></div>
          <div><span>📅</span> {new Date(test.createdAt).toLocaleDateString()}</div>
        </div>

        {/* RANK */}
        <div className="rank-box">
          <div className="rank-badge">
            🏆 <span>1st Rank</span>
          </div>

          <div className="summary">
            <p className="green">✔ {correct} Correct</p>
            <p className="red">✖ 0 Incorrect</p>
            <p className="orange">➖ 0 Skipped</p>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="question-list">
          {answers.map((q, i) => (
            <div key={i} className="question-item">
              <h4>Q{i + 1}. {q.question}</h4>
              <p>Your Answer: <b>{q.userAnswer}</b></p>
              <p className="correct">Correct Answer: {q.correctAnswer}</p>
              <span className="right">Right</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MyTest;

