import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import "../styles/mytest.css";

function MyTest() {
  const navigate = useNavigate();
  const { contestId } = useParams();

  const [contest, setContest] = useState(null);
  const [tests, setTests] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contestId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch both datasets simultaneously
        const [resultsRes, contestRes] = await Promise.all([
          API.get(`/results/my-tests/${contestId}`),
          API.get(`/contests/${contestId}`)
        ]);

        setTests(resultsRes.data);
        setContest(contestRes.data);
      } catch (err) {
        console.error("Error loading MyTest data:", err);
        alert("Failed to load test results");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contestId]);

  const toggleResult = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="screen"><h3>Loading results...</h3></div>;

  return (
    <div className="screen">
      {/* BACK BUTTON */}
      
        <i 
          className="material-icons" 
          onClick={() => navigate("/entry")}
          style={{ cursor: "pointer" }}
        >
          arrow_back
        </i>
      

      {/* NAVIGATION TABS */}
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
            // FIX: Use contest object instead of tests array for navigation
            if (contest?.test?._id) {
              navigate(`/leaderboard/${contest.test._id}?contest=${contest._id}`);
            } else {
              alert("Leaderboard information is currently unavailable.");
            }
          }}
        >
          LEADERBOARD
        </div>

        <div className="header-item active">MY TEST</div>
      </div>

      {/* RESULT LIST */}
      <div className="results-container">
        {tests.length === 0 ? (
          <div className="no-data-card">
            <p>No tests attempted in this contest yet.</p>
            
          </div>
        ) : (
          tests.map((test, index) => {
            const answersArray = test.answers ? Object.values(test.answers) : [];
            const correctCount = answersArray.filter(a => a.userAnswer === a.correctAnswer).length;
            const incorrectCount = answersArray.filter(a => a.userAnswer && a.userAnswer !== a.correctAnswer).length;
            const skippedCount = answersArray.length - (correctCount + incorrectCount);
            const accuracy = answersArray.length > 0 ? ((correctCount / answersArray.length) * 100).toFixed(0) : 0;

            return (
              <div key={test._id || index} className="test-card-wrapper">
                {/* OVERVIEW STATS */}
                <div className="stats-grid">
                  <div><span>⏱</span> Time: <b>{test.timeTaken}s</b></div>
                  <div><span>✅</span> Score: <b>{correctCount}/{answersArray.length}</b></div>
                  <div><span>🎯</span> Accuracy: <b>{accuracy}%</b></div>
                  <div><span>📅</span> {new Date(test.createdAt).toLocaleDateString()}</div>
                </div>

                <button className="view-btn" onClick={() => toggleResult(index)}>
                  {openIndex === index ? "Hide Detailed Result" : "View Detailed Result"}
                </button>

                {/* EXPANDABLE SECTION */}
                {openIndex === index && (
                  <div className="details-expanded">
                    <div className="rank-box">
                      <div className="rank-badge">
                        🏆 <span>Performance Summary</span>
                      </div>
                      <div className="summary">
                        <p className="green">✔ {correctCount} Correct</p>
                        <p className="red">✖ {incorrectCount} Incorrect</p>
                        <p className="orange">➖ {skippedCount} Skipped</p>
                      </div>
                    </div>

                    <div className="question-list">
                      {answersArray.map((q, i) => {
                        const isCorrect = q.userAnswer === q.correctAnswer;
                        const isSkipped = !q.userAnswer;
                        
                        return (
                          <div key={i} className={`question-item ${isCorrect ? "is-right" : "is-wrong"}`}>
                            <h4>Q{i + 1}. {q.question}</h4>
                            <p>Your Answer: 
                              <span className={isCorrect ? "text-green" : isSkipped ? "text-orange" : "text-red"}>
                                {q.userAnswer || "Not Answered"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="correct-ans">Correct Answer: {q.correctAnswer}</p>
                            )}
                            <span className={`status-tag ${isCorrect ? "right" : "wrong"}`}>
                              {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Incorrect"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyTest;