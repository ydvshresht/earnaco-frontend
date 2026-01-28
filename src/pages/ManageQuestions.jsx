import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

function ManageQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await API.get("/admin/questions");
      setQuestions(res.data);
    } catch {
      alert("Failed to load questions");
    }
  };

  // ❌ DELETE QUESTION
  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(`/admin/delete-question/${id}`);
      alert("Question deleted");
      loadQuestions();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>

      <h2>📋 Manage Questions</h2>

      {questions.length === 0 ? (
        <p>No questions found</p>
      ) : (
        questions.map((q, i) => (
          <div key={q._id} className="question-card">
            <strong>
              {i + 1}. {q.question}
            </strong>

            <ul>
              {q.options.map((opt, index) => (
                <li key={index}>
                  {index === q.correctAnswer ? "✅" : "⭕"} {opt}
                </li>
              ))}
            </ul>

            <button
              className="danger"
              onClick={() => deleteQuestion(q._id)}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageQuestions;
