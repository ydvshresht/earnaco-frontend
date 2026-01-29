import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateTest() {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createTest = async () => {
    if (!testName) {
      alert("Test name required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/tests", {
        testName,
        duration
      });

      alert("Test created. Now add questions.");

      // 👉 Redirect to add/manage questions for this test
      navigate(`/admin/manage-tests/${res.data._id}`);
    } catch (err) {
      alert("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
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
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <button onClick={createTest} disabled={loading}>
        {loading ? "Creating..." : "Create Test"}
      </button>

      <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "10px" }}>
        ⚠️ Test will not be playable until questions are added
      </p>
    </div>
  );
}

export default CreateTest;
