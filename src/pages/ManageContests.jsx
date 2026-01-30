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
    if (!window.confirm("Delete contest?")) return;
    await API.delete(`/admin/contest/${id}`);
    loadContests();
  };

  return (
    <div className="screen">
      <h3>Manage Contests</h3>

      {contests.map(c => (
        <div key={c._id}>
          <b>{c.test?.testName}</b> | Prize: {c.prizePool}
          <button onClick={() => deleteContest(c._id)}>Delete</button>
        </div>
      ))}

      <hr />

      <button onClick={() => navigate("/admin/create-test")}>
        + Create New Test & Contest
      </button>
    </div>
  );
}

export default ManageContests;
