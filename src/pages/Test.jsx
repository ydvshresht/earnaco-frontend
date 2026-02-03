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
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [result, setResult] = useState(null);

  const submittedRef = useRef(false);

  /* =====================
     INIT TEST
  ===================== */
  useEffect(() => {
    const initTest = async () => {
      try {
        const attemptRes = await API.get(
          `/results/attempted/${contestId}`
        );
        if (attemptRes.data.attempted) {
          alert("Already attempted");
          navigate("/entry");
          return;
        }

        await API.get(`/contests/can-start/${contestId}`);

        const res = await API.get(`/tests/${testId}`);
        setQuestions(res.data.questions);

        const duration = res.data.duration * 60;
        setTotalDuration(duration);
        setTimeLeft(duration);

        setStarted(true);
        setLoading(false);
      } catch {
        alert("Not allowed");
        navigate("/entry");
      }
    };

    initTest();
  }, [testId, contestId, navigate]);

  /* TIMER */
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft(t => t - 1),
      1000
    );
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  /* AUTO SUBMIT */
  useEffect(() => {
    if (started && timeLeft === 0 && !submittedRef.current) {
      submitTest();
    }
  }, [timeLeft]);

  /* SUBMIT */
  /* SUBMIT */
const submitTest = async () => {
  if (submittedRef.current) return;

  try {
    submittedRef.current = true;

    const res = await API.post("/results/submit", {
      testId,
      contestId,
      answers,
      timeTaken: totalDuration - timeLeft
    });
const userRes = await API.get("/auth/me");
    // ✅ clear started flag
   sessionStorage.removeItem(
  `started-${contestId}-${userRes.data._id}`
);

    setResult({
      total: res.data.totalQuestions,
      correct: res.data.score,
      wrong: res.data.totalQuestions - res.data.score
    });

    setStarted(false);
  } catch (err) {
    // 🔓 allow retry if failed
    submittedRef.current = false;

    alert(
      err.response?.data?.msg || "Submit failed, please try again"
    );
  }
};


  if (loading) return <h3>Loading test...</h3>;
  if (result) {
    return (
      <div className="screen">
        <h2>Result</h2>
        <p>Correct: {result.correct}</p>
        <p>Wrong: {result.wrong}</p>
        <button onClick={() => navigate("/entry")}>
          Back to Entry
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

   return (
    <div className="test-screen">

      {/* TIMER + PROGRESS */}
      <div className="top-bar">
        <div className="timer">
          ⏱ {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        <div className="progress">
          {questions.map((_, i) => (
            <span
              key={i}
              className={i <= currentIndex ? "dot active" : "dot"}
            />
          ))}
        </div>
      </div>

      {/* QUESTION COUNT */}
      <p className="q-count">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* QUESTION */}
      <div className="question-box">
        {q.question}
      </div>

      {/* OPTIONS */}
      <div className="options">
        {q.options.map((opt, i) => (
          <label
            key={i}
            className={
              answers[currentIndex] === i
                ? "option selected"
                : "option"
            }
          >
            <span>{opt}</span>
            <input
              type="radio"
              checked={answers[currentIndex] === i}
              onChange={() => {
                const copy = [...answers];
                copy[currentIndex] = i;
                setAnswers(copy);
              }}
            />
          </label>
        ))}
      </div>

      {/* NAV BUTTONS */}
      <div className="nav-buttons">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(i => i - 1)}
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button className="submit" onClick={submitTest}>
            Submit
          </button>
        ) : (
          <button onClick={() => setCurrentIndex(i => i + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Test;
