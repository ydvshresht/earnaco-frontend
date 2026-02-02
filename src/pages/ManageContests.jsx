import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function ManageContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
    const res = await API.get("/contests/admin");

      setContests(res.data);
    } catch {
      
      alert("Failed to load contests");
    } finally {
      setLoading(false);
    }
  };

 const deleteContest = async (contest) => {
  if (contest.joinedUsers?.length > 0) {
    return alert("Cannot delete contest with entries");
  }

  try {
    await API.delete(`/contests/admin/${contest._id}`);
    loadContests();
  } catch (err) {
    console.error(err);
    alert("Failed to delete contest");
  }
};


const getStatusBadge = (contest) => {
  if (contest.status === "completed") return "✅ Completed";
  if (contest.status === "live") return "🟢 Live";
  return "🟡 Draft";
};


  if (loading) return <h3>Loading contests...</h3>;

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
      <h3>Manage Contests</h3>

      <button
        style={{ marginBottom: 20 }}
        onClick={() => navigate("/admin/create-contest-wizard")}
      >
        + Create New Contest
      </button>

      {contests.length === 0 && (
        <p>No contests created yet.</p>
      )}

      {contests.map((c) => (
        <div
          key={c._id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6
          }}
        >
          <b>{c.test?.testName || "Untitled Test"}</b>
          <div style={{ fontSize: 14, marginTop: 4 }}>
            Prize: ₹{c.prizePool} | Entry: ₹{c.entryFee} | Spots: {c.maxSpots}
          </div>

          <div style={{ marginTop: 6 }}>
            Status: <b>{getStatusBadge(c)}</b>
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() =>
                navigate(`/admin/contests/${c._id}/edit`)
              }
            >
              Edit
            </button>

            <button
              style={{ marginLeft: 10, color: "red" }}
              onClick={() => deleteContest(c)}
            >
              Delete
            </button>
            {c.status === "live" && (
  <button
    style={{ marginLeft: 10 }}
    onClick={async () => {
      try {
        await API.post(`/contests/admin/${c._id}/reset`);
        loadContests();
      } catch (err) {
        alert(err.response?.data?.msg || "Reset failed");
      }
    }}
  >
    Reset
  </button>
)}


          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageContests;
