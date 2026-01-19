import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/question.css";

function AdminQuestions() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
 const navigate = useNavigate();
  const loadQuestions = async () => {
    const res = await API.get("/admin/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const submitQuestion = async () => {
    try {
      await API.post("/admin/add-question", {
        question,
        options,
        correctAnswer: correct,
        difficulty
      });
      alert("Question added");
      setQuestion("");
      setOptions(["", "", "", ""]);
      loadQuestions();
    } catch {
      alert("Failed to add question");
    }
  };

  return ( <div className="container">
      <div className="icon-text"><i className="material-icons" onClick={() => navigate("/admin")}>arrow_back</i>
   Add Question</div>
      

      <input className="ques"
        placeholder="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => {
            const copy = [...options];
            copy[i] = e.target.value;
            setOptions(copy);
          }}
        />
      ))}

      <label>Correct Option</label>
      <select onChange={e => setCorrect(Number(e.target.value))}>
        <option value={0}>Option 1</option>
        <option value={1}>Option 2</option>
        <option value={2}>Option 3</option>
        <option value={3}>Option 4</option>
      </select>

      <label>Difficulty</label>
      <select onChange={e => setDifficulty(e.target.value)}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>

      <button onClick={submitQuestion}>Add Question</button>

      <hr />

      <h3>Total Questions: {questions.length}</h3>
    </div>
  );
}

export default AdminQuestions;
