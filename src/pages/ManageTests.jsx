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
    await API.delete(`/admin/test/${id}`);
    loadTests();
  };

  return (
    <div className="screen">
         <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <h3>Manage Tests</h3>

      {tests.map((t) => (
        <div key={t._id}>
          <b>{t.testName}</b>
          <button onClick={() => deleteTest(t._id)}>Delete</button>
        </div>
      ))}
       <button onClick={() => navigate("/admin/create-test")}>
  + Create Test
</button>
    </div>
  );
}

export default ManageTests;
