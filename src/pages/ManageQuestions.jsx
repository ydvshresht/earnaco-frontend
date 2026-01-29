import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

function ManageTestQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  /* =====================
     LOAD TEST
  ===================== */
  useEffect(() => {
    const loadTest = async () => {
      try {
        const res = await API.get(`/tests/${testId}`);
        setTest(res.data);
      } catch {
        alert("Failed to load test");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [testId, navigate]);

  /* =====================
     ADD QUESTION
  ===================== */
  const addQuestion = async () => {
    if (!question || options.some(o => !o)) {
      return alert("Fill all fields");
    }

    try {
      await API.post(`/admin/tests/${testId}/questions`, {
        question,
        options,
        correctAnswer
      });

      alert("Question added");

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);

      const updated = await API.get(`/tests/${testId}`);
      setTest(updated.data);
    } catch {
      alert("Failed to add question");
    }
  };

  /* =====================
     DELETE QUESTION
  ===================== */
  const deleteQuestion = async (index) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(
        `/admin/tests/${testId}/questions/${index}`
      );

      const updated = await API.get(`/tests/${testId}`);
      setTest(updated.data);
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (!test) return null;

  return (
    <div className="screen">
      <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>

      <h2>🧠 Manage Questions</h2>
      <p><b>Test:</b> {test.testName}</p>
      <p>⏱ {test.duration} mins</p>

      {/* EXISTING QUESTIONS */}
      {test.questions.length === 0 ? (
        <p>No questions added yet</p>
      ) : (
        test.questions.map((q, i) => (
          <div key={i} className="question-card">
            <strong>{i + 1}. {q.question}</strong>
            <ul>
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  {idx === q.correctAnswer ? "✅" : "⭕"} {opt}
                </li>
              ))}
            </ul>
            <button
              className="danger"
              onClick={() => deleteQuestion(i)}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}

      <hr />

      {/* ADD QUESTION */}
      <h3>➕ Add Question</h3>

      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const copy = [...options];
            copy[i] = e.target.value;
            setOptions(copy);
          }}
        />
      ))}

      <label>
        Correct Answer:
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>
      </label>

      <button onClick={addQuestion}>
        Add Question
      </button>
    </div>
  );
}

export default ManageTestQuestions;
