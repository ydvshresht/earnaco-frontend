import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateTest() {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const createTest = async () => {
    if (!testName) {
      alert("Test name required");
      return;
    }

    await API.post("/tests", {
      testName,
      duration,
      questions: []
    });

    navigate("/admin/manage-tests");
  };

  return (
    <div className="page">
         <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <h3>Create Test</h3>

      <input
        placeholder="Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button onClick={createTest}>Create Test</button>
    </div>
  );
}

export default CreateTest;
