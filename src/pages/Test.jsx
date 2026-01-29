import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api/api";

function Test() {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contest");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // ✅ ARRAY

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [result, setResult] = useState(null);
  const submittedRef = useRef(false); // 🔒 prevent double submit

  /* =====================
     INIT TEST
  ===================== */
  useEffect(() => {
    const initTest = async () => {
      try {
        // Re-attempt check
        const attemptRes = await API.get(`/results/attempted/${testId}`);
        if (attemptRes.data.attempted) {
          alert("You have already attempted this test");
          navigate("/entry");
          return;
        }

        // Contest permission
        await API.get(`/contests/can-start/${contestId}`);

        // Load test
        const res = await API.get(`/tests/${testId}`);

        if (!res.data?.questions || res.data.questions.length === 0) {
          alert("No questions found");
          navigate("/entry");
          return;
        }

        setQuestions(res.data.questions);

        const duration = res.data.duration * 60;
        setTotalDuration(duration);
        setTimeLeft(duration);

        setStarted(true);
        setLoading(false);
      } catch (err) {
        alert(err.response?.data?.msg || "Not allowed to start test");
        navigate("/entry");
      }
    };

    initTest();
  }, [testId, contestId, navigate]);

  /* =====================
     TIMER
  ===================== */
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  /* =====================
     AUTO SUBMIT
  ===================== */
  useEffect(() => {
    if (started && timeLeft === 0 && !submittedRef.current) {
      submitTest();
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  /* =====================
     SUBMIT
  ===================== */
  const submitTest = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

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

  /* =====================
     SAFETY GUARDS
  ===================== */
  if (loading) return <h3>Loading test...</h3>;
  if (!questions.length) return <h3>No questions available</h3>;

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <h3>Invalid question</h3>;

  /* =====================
     RESULT SCREEN
  ===================== */
  if (result) {
    return (
      <div className="screen" style={{ padding: "40px" }}>
        <h2>📊 Test Result</h2>
        <p>Total Questions: {result.total}</p>
        <p>Correct: {result.correct}</p>
        <p>Wrong: {result.wrong}</p>

        <button
          onClick={() =>
            navigate(`/leaderboard/${testId}?contest=${contestId}`)
          }
        >
          View Leaderboard 🏆
        </button>

        <br /><br />

        <button onClick={() => navigate("/entry")}>
          Back to Entry
        </button>
      </div>
    );
  }

  /* =====================
     TEST UI
  ===================== */
  return (
    <div className="screen" style={{ padding: "40px" }}>
      <h3>
        ⏱️ {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </h3>

      <h4>
        Question {currentIndex + 1} / {questions.length}
      </h4>

      <h2>{currentQuestion.question}</h2>

      {currentQuestion.options.map((opt, i) => (
        <label key={i} style={{ display: "block" }}>
          <input
            type="radio"
            checked={answers[currentIndex] === i}
            onChange={() => {
              const copy = [...answers];
              copy[currentIndex] = i;
              setAnswers(copy);
            }}
          />
          {opt}
        </label>
      ))}

      <br />

      <button
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex((i) => i - 1)}
      >
        Previous
      </button>

      {currentIndex === questions.length - 1 ? (
        <button
          onClick={submitTest}
          style={{
            marginLeft: "10px",
            background: "red",
            color: "white"
          }}
        >
          Submit Test
        </button>
      ) : (
        <button
          onClick={() => setCurrentIndex((i) => i + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Test;
