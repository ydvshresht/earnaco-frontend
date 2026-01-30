import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateTest() {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createTest = async () => {
    if (!testName) return alert("Test name required");

    try {
      setLoading(true);

      const res = await API.post("/tests", {
        testName,
        duration
      });

      navigate(`/admin/tests/${res.data.test._id}/questions`);
    } catch {
      alert("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
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
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <button onClick={createTest} disabled={loading}>
        {loading ? "Creating..." : "Create & Add Questions"}
      </button>
    </div>
  );
}

export default CreateTest;
