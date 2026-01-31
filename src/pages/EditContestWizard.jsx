import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function EditContestWizard() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(2); // start from questions
  const [loading, setLoading] = useState(true);

  const [editable, setEditable] = useState(true);

  const [contest, setContest] = useState(null);
  const [testId, setTestId] = useState(null);

  /* contest fields */
  const [prizePool, setPrizePool] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxSpots, setMaxSpots] = useState("");

  /* questions */
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  /* ===============================
     LOAD CONTEST FOR EDIT
  ================================ */
  useEffect(() => {
    loadContest();
  }, []);

  const loadContest = async () => {
    try {
      const res = await API.get(`/contests/admin/${contestId}/edit`);
      const c = res.data.contest;

      setContest(c);
      setEditable(res.data.editable);

      setTestId(c.test._id);
      setQuestions(c.test.questions || []);

      setPrizePool(c.prizePool);
      setEntryFee(c.entryFee);
      setMaxSpots(c.maxSpots);
    } catch {
      alert("Failed to load contest");
      navigate("/admin/manage-contests");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CLONE TEST IF REQUIRED
  ================================ */
  const ensureEditableTest = async () => {
    if (editable) return testId;

    const res = await API.post(`/tests/admin/${testId}/clone`);
    setTestId(res.data.test._id);
    setQuestions(res.data.test.questions || []);
    setEditable(true);

    return res.data.test._id;
  };

  /* ===============================
     ADD QUESTION
  ================================ */
  const addQuestion = async () => {
    if (!question || options.some(o => !o)) {
      return alert("Fill all fields");
    }

    const activeTestId = await ensureEditableTest();

    await API.post(`/tests/admin/${activeTestId}/questions`, {
      question,
      options,
      correctAnswer
    });

    setQuestions([
      ...questions,
      { question, options, correctAnswer }
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  /* ===============================
     DELETE QUESTION
  ================================ */
  const deleteQuestion = async (index) => {
    if (!window.confirm("Delete question?")) return;

    const activeTestId = await ensureEditableTest();

    await API.delete(
      `/tests/admin/${activeTestId}/questions/${index}`
    );

    const copy = [...questions];
    copy.splice(index, 1);
    setQuestions(copy);
  };

  /* ===============================
     SAVE CONTEST (FINAL STEP)
  ================================ */
  const saveChanges = async () => {
    if (questions.length === 0) {
      return alert("Test must have at least one question");
    }

    try {
      /* update contest settings */
      await API.patch(`/admin/contests/${contestId}`, {
        prizePool,
        entryFee,
        maxSpots
      });

      /* switch contest test if cloned */
      await API.patch(`/admin/contests/${contestId}/switch-test`, {
        testId
      });

      /* finalize test */
      await API.patch(`/tests/admin/${testId}/finalize`);

      navigate("/admin/manage-contests");
    } catch {
      alert("Failed to save changes");
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="screen">
      <h3>Edit Contest Wizard</h3>

      {!editable && (
        <div className="warning">
          ⚠ This contest already has entries.  
          Editing questions will create a new test version.
        </div>
      )}

      {/* STEP 2 – QUESTIONS */}
      {step === 2 && (
        <>
          <h4>Step 1: Edit Questions</h4>

          {questions.map((q, i) => (
            <div key={i}>
              <b>{i + 1}. {q.question}</b>
              <ul>
                {q.options.map((o, idx) => (
                  <li key={idx}>
                    {idx === q.correctAnswer ? "✅" : "⭕"} {o}
                  </li>
                ))}
              </ul>
              <button onClick={() => deleteQuestion(i)}>
                Delete
              </button>
            </div>
          ))}

          <hr />

          <h4>Add Question</h4>

          <input
            placeholder="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />

          {options.map((o, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={o}
              onChange={e => {
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
            />
          ))}

          <select
            value={correctAnswer}
            onChange={e => setCorrectAnswer(+e.target.value)}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>

          <button onClick={addQuestion}>+ Add Question</button>

          <br /><br />

          <button
            disabled={questions.length === 0}
            onClick={() => setStep(3)}
          >
            Next → Contest Settings
          </button>
        </>
      )}

      {/* STEP 3 – CONTEST SETTINGS */}
      {step === 3 && (
        <>
          <h4>Step 2: Contest Settings</h4>

          <input
            placeholder="Prize Pool"
            value={prizePool}
            onChange={e => setPrizePool(e.target.value)}
          />

          <input
            placeholder="Entry Fee"
            value={entryFee}
            onChange={e => setEntryFee(e.target.value)}
          />

          <input
            placeholder="Max Spots"
            value={maxSpots}
            onChange={e => setMaxSpots(e.target.value)}
          />

          <button onClick={saveChanges}>
            Save Changes ✅
          </button>
        </>
      )}
    </div>
  );
}

export default EditContestWizard;
