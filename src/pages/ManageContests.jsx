import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function ManageContests() {
  const [contests, setContests] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    const res = await API.get("/admin/contests");
    setContests(res.data);
  };

  const deleteContest = async (id) => {
    await API.delete(`/admin/contest/${id}`);
    loadContests();
  };

  return (
    <div className="container">
         <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <h3>Manage Contests</h3>

      {contests.map((c) => (
        <div key={c._id}>
          <b>{c.test?.testName}</b> | ₹{c.prizePool}
          <button onClick={() => deleteContest(c._id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => navigate("/admin/create-contest")}>
  + Create Contest
</button>

    </div>
  );
}

export default ManageContests;
