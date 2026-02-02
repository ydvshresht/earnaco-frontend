import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import "../styles/mytest.css";

function MyTest() {
  const navigate = useNavigate();
  const { contestId } = useParams();

  const [tests, setTests] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
useEffect(() => {
  if (!contestId) return; // 🛑 prevent invalid call

  const loadTests = async () => {
    try {
      const res = await API.get(
        `/results/my-tests/${contestId}`
      );
      setTests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load test results");
    }
  };

  loadTests();
}, [contestId]);

  const toggleResult = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ SAFE IDs
  const testId = tests[0]?.test?._id || null;

  return (
    <div className="screen">
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/entry")}
        >
          arrow_back
        </i>
      </div>

      {/* ✅ HEADER */}
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

            navigate(
              `/leaderboard/${testId}?contest=${contestId}`
            );
          }}
        >
          LEADERBOARD
        </div>

        <div className="header-item active">
          MY TEST
        </div>
      </div>

      {/* ✅ RESULT LIST */}
      {tests.length === 0 ? (
        <p>No tests attempted in this contest.</p>
      ) : (
        tests.map((test, index) => {
          const answers = test.answers
            ? Object.values(test.answers)
            : [];

          return (
            <div className="test-card" key={test._id}>
              <strong>{test.test?.testName}</strong>

              <div className="icon-text">
                <p>
                  <i className="material-icons">access_time</i>
                  Time: {test.timeTaken}s
                  &nbsp;&nbsp;
                  <i className="material-icons">
                    calendar_today
                  </i>
                  {new Date(test.createdAt).toLocaleString()}
                </p>
              </div>

              <button onClick={() => toggleResult(index)}>
                {openIndex === index
                  ? "Hide Result"
                  : "View Result"}
              </button>

              {openIndex === index && (
                <div className="result-box">
                  {answers.map((q, i) => (
                    <div key={i} className="question-box">
                      <p>
                        <strong>Q{i + 1}:</strong>{" "}
                        {q.question}
                      </p>
                      <p>Your Answer: {q.userAnswer}</p>
                      <p>
                        Correct Answer:{" "}
                        {q.correctAnswer}
                      </p>
                      <p
                        style={{
                          color:
                            q.status === "Right"
                              ? "green"
                              : "red"
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
