import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function ManageTestQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    const res = await API.get(`/tests/${testId}`);
    setTest(res.data);
  };

  const addQuestion = async () => {
    if (!question || options.some(o => !o)) {
      return alert("Fill all fields");
    }

    await API.post(`/admin/tests/${testId}/questions`, {
      question,
      options,
      correctAnswer
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);

    loadTest();
  };

  const deleteQuestion = async (index) => {
    if (!window.confirm("Delete question?")) return;
    await API.delete(`/admin/tests/${testId}/questions/${index}`);
    loadTest();
  };

  if (!test) return <h3>Loading...</h3>;

  return (
    <div className="screen">
      <h3>{test.testName}</h3>
      <p>Duration: {test.duration} minutes</p>

      {test.questions.map((q, i) => (
        <div key={i}>
          <b>{i + 1}. {q.question}</b>
          <ul>
            {q.options.map((o, idx) => (
              <li key={idx}>
                {idx === q.correctAnswer ? "✅" : "⭕"} {o}
              </li>
            ))}
          </ul>
          <button onClick={() => deleteQuestion(i)}>Delete</button>
        </div>
      ))}

      <hr />

      <h4>Add Question</h4>

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

      <select
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(Number(e.target.value))}
      >
        <option value={0}>Option 1</option>
        <option value={1}>Option 2</option>
        <option value={2}>Option 3</option>
        <option value={3}>Option 4</option>
      </select>

      <button onClick={addQuestion}>Add Question</button>

      <hr />

      <button
        disabled={test.questions.length === 0}
        onClick={() =>
          navigate(`/admin/create-contest?testId=${testId}`)
        }
      >
        Next → Create Contest
      </button>
    </div>
  );
}

export default ManageTestQuestions;
