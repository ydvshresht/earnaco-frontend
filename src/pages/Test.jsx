import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function Test() {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contest");
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [result, setResult] = useState(null);

  // 🔐 Permission check + Load test
  useEffect(() => {
    const initTest = async () => {
      try {
        // 1️⃣ Check re-attempt
        const attemptRes = await API.get(`/results/attempted/${testId}`);
        if (attemptRes.data.attempted) {
          alert("You have already attempted this test");
          navigate("/entry");
          return;
        }

        // 2️⃣ Check contest permission
        await API.get(`/contests/can-start/${contestId}`);

        // 3️⃣ Load test
        const res = await API.get(`/tests/${testId}`);
        setQuestions(res.data.questions);

        const duration = res.data.duration * 60;
        setTotalDuration(duration);
        setTimeLeft(duration);

        setStarted(true); // 🔥 AUTO START
        setLoading(false);
      } catch (err) {
        alert(err.response?.data?.msg || "Not allowed to start test");
        navigate("/entry");
      }
    };

    initTest();
  }, [contestId, testId, navigate]);

  // ⏱️ Timer
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // ⏰ Auto submit
  useEffect(() => {
    if (started && timeLeft === 0) {
      submitTest();
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  // 🧮 Submit test
  const submitTest = async () => {
    const timeTaken = totalDuration - timeLeft;

    try {
      const res = await API.post("/results/submit", {
        testId,
        contestId,
        answers,
        timeTaken
      });

      setResult({
        total: res.data.totalQuestions,
        correct: res.data.score,
        wrong: res.data.totalQuestions - res.data.score
      });

      setStarted(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Submit failed");
    }
  };

  if (loading) return <h3>Loading test...</h3>;

  // 📊 RESULT SCREEN
  if (result) {
    return (<div id="app">
      <div className="page">
      <div style={{ padding: "40px" }}>
        <h2>📊 Test Result</h2>
        <p>Total Questions: {result.total}</p>
        <p>Correct: {result.correct}</p>
        <p>Wrong: {result.wrong}</p>

        <button onClick={() => navigate(`/leaderboard/${testId}?contest=${contestId}`)}>
          View Leaderboard 🏆
        </button>

        <br /><br />

        <button onClick={() => navigate("/entry")}>
          Back to Entry
        </button>
      </div></div></div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (<div id="app">
    <div className="page">
    <div style={{ padding: "40px" }}>
      <h3>
        ⏱️ {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </h3>

      <h4>
        Question {currentIndex + 1} / {questions.length}
      </h4>

      <h2>{currentQuestion.question}</h2>

      {currentQuestion.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              checked={answers[currentIndex] === i}
              onChange={() =>
                setAnswers({ ...answers, [currentIndex]: i })
              }
            />
            {opt}
          </label>
        </div>
      ))}

      <br />

      <button
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex(currentIndex - 1)}
      >
        Previous
      </button>

     {/* NEXT / SUBMIT */}
{currentIndex === questions.length - 1 ? (
  <button
    onClick={submitTest}
    style={{
      marginLeft: "10px",
      backgroundColor: "red",
      color: "white",
      padding: "8px 14px",
      border: "none"
    }}
  >
    Submit Test
  </button>
) : (
  <button
    onClick={() => setCurrentIndex(currentIndex + 1)}
    style={{ marginLeft: "10px" }}
  >
    Next
  </button>)}
    </div></div></div>
  );
}

export default Test;
