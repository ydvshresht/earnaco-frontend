import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function ManageTests() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const res = await API.get("/admin/tests");
    setTests(res.data);
  };

  const deleteTest = async (id) => {
    if (!window.confirm("Delete test?")) return;
    await API.delete(`/admin/test/${id}`);
    loadTests();
  };

  return (
    <div className="screen">
      <div className="back-btn" onClick={() => navigate(-1)}>← Back</div>
      <h3>Manage Tests</h3>

      {tests.map((t) => (
        <div key={t._id} style={{ marginBottom: 10 }}>
          <b>{t.testName}</b>

          <button
            onClick={() =>
              navigate(`/admin/tests/${t._id}/questions`)
            }
            style={{ marginLeft: 10 }}
          >
            Manage Questions
          </button>

          <button
            onClick={() => deleteTest(t._id)}
            style={{ marginLeft: 10, color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}

      <button onClick={() => navigate("/admin/create-test")}>
        + Create Test
      </button>
    </div>
  );
}

export default ManageTests;
