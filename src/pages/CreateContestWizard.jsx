import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateContestWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [testId, setTestId] = useState(null);
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(10);

  const navigate = useNavigate();

  const createTest = async () => {
    if (!testName) return alert("Test name required");

    setLoading(true);
    const res = await API.post("/tests", { testName, duration });
    setTestId(res.data.test._id);
    setLoading(false);
    setStep(2);
  };
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [questions, setQuestions] = useState([]);

  const addQuestion = async () => {
    if (!question || options.some(o => !o)) {
      return alert("Fill all fields");
    }

    await API.post(`/tests/admin/${testId}/questions`, {
      question,
      options,
      correctAnswer
    });

    setQuestions([...questions, { question, options, correctAnswer }]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };
  const [prizePool, setPrizePool] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxSpots, setMaxSpots] = useState("");
const createContest = async () => {
  if (questions.length === 0) {
    return alert("Add at least one question");
  }

  try {
    // 1️⃣ FINALIZE TEST FIRST
    await API.patch(`/tests/admin/${testId}/finalize`);

    // 2️⃣ CREATE CONTEST (draft)
    const res = await API.post("/contests", {
      test: testId,
      prizePool,
      entryFee,
      maxSpots
    });

    const contestId = res.data.contest._id;

    // 3️⃣ PUBLISH CONTEST
    await API.patch(`/contests/admin/${contestId}/live`);


    setStep(4);
  } catch (err) {
    console.error(err);
    alert("Failed to create contest");
  }
};


  return (
    <div className="screen">
       {/* BACK */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/admin")}
          style={{ cursor: "pointer" }}
        >
          arrow_back
        </i></div>
      <h3>Create Contest Wizard</h3>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h4>Step 1: Create Test</h4>
          <input placeholder="Test Name" value={testName}
            onChange={e => setTestName(e.target.value)} />

          <input type="number" placeholder="Duration (min)"
            value={duration}
            onChange={e => setDuration(+e.target.value)} />

          <button onClick={createTest} disabled={loading}>
            Create Test →
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h4>Step 2: Add Questions</h4>

          <input placeholder="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)} />

          {options.map((o, i) => (
            <input key={i}
              placeholder={`Option ${i + 1}`}
              value={o}
              onChange={e => {
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
            />
          ))}

          <select value={correctAnswer}
            onChange={e => setCorrectAnswer(+e.target.value)}>
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>

          <button onClick={addQuestion}>+ Add Question</button>

          <p>Questions Added: {questions.length}</p>

          <button
            disabled={questions.length === 0}
            onClick={() => setStep(3)}
          >
            Next → Contest Settings
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h4>Step 3: Contest Settings</h4>

          <input placeholder="Prize Pool"
            value={prizePool}
            onChange={e => setPrizePool(e.target.value)} />

          <input placeholder="Entry Fee"
            value={entryFee}
            onChange={e => setEntryFee(e.target.value)} />

          <input placeholder="Max Spots"
            value={maxSpots}
            onChange={e => setMaxSpots(e.target.value)} />

          <button onClick={createContest}>
            Create Contest 🚀
          </button>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <h3>✅ Contest Created Successfully</h3>
          <button onClick={() => navigate("/admin/manage-contests")}>
            Go to Manage Contests
          </button>
        </>
      )}
    </div>
  );
}

export default CreateContestWizard;
