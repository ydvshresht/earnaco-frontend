import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/mytest.css";

function MyTest() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const res = await API.get("/results/my-tests");
        setTests(res.data);
      } catch {
        alert("Failed to load test results");
      }
    };
    loadTests();
  }, []);

  const toggleResult = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 🔑 SAFE IDs FOR HEADER (from first test)
  const headerContestId = tests[0]?.contest || null;
  const headerTestId = tests[0]?.test?._id || null;

  return (
    <div className="screen">
 <div className="icon-text"><i className="material-icons" onClick={() => navigate("/entry")}>arrow_back</i>
      </div>
      {/* ✅ COUPON HEADER */}

      <div className="coupon-header">
        <div
          className="header-item"
          onClick={() => {
            if (!headerContestId) return alert("Contest not found");
            navigate(`/contest/${headerContestId}`);
          }}
        >
          CONTEST
        </div>

        <div
          className="header-item"
          onClick={() => {
            if (!headerTestId || !headerContestId)
              return alert("Leaderboard not available");
            navigate(
              `/leaderboard/${headerTestId}?contest=${headerContestId}`
            );
          }}
        >
          LEADERBOARD
        </div>

        <div className="header-item">MY TEST</div>
      </div>

      {/* ✅ TEST LIST */}
      {tests.length === 0 ? (
        <p>No tests attempted yet.</p>
      ) : (
        tests.map((test, index) => {
          const answers = test.answers
            ? Object.values(test.answers)
            : [];

          return (
            <div className="test-card" key={test._id}>
              <strong>{test.test?.testName}</strong>
             <div className="icon-text"> <p> <i className="material-icons">access_time</i> Time: {test.timeTaken}s 
             <i className="material-icons">calendar_today</i>Date: {new Date(test.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => toggleResult(index)}>
                {openIndex === index ? "Hide Result" : "View Result"}
              </button>


              {openIndex === index && (
                <div className="result-box">
                  {answers.map((q, i) => (
                    <div key={i} className="question-box">
                      <p><strong>Q{i + 1}:</strong> {q.question}</p>
                      <p>Your Answer: {q.userAnswer}</p>
                      <p>Correct Answer: {q.correctAnswer}</p>
                      <p
                        style={{
                          color: q.status === "Right" ? "green" : "red"
                        }}
                      >
                        {q.status}
                      </p>
                      <hr />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyTest;
