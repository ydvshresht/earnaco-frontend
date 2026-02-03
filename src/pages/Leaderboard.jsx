import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/leaderboard.css";

function Leaderboard() {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contest");
  const navigate = useNavigate();

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH LEADERBOARD
  ===================== */
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/results/leaderboard/${testId}`);
        setLeaders(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          alert(err.response.data.msg);
        } else {
          alert("Failed to load leaderboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  if (loading) return <h3>Loading leaderboard...</h3>;

   return (
    <div className="leaderboard-screen">

      {/* BACK */}
      <i
        className="material-icons back"
        onClick={() => navigate("/entry")}
      >
        arrow_back
      </i>

      {/* TABS */}
      <div className="leaderboard-tabs">
        <div
          className="tab"
          onClick={() => navigate(`/contest/${contestId}`)}
        >
          CONTEST
        </div>
        <div className="tab active">LEADERBOARD</div>
        <div
          className="tab"
          onClick={() => navigate(`/my-test/${contestId}`)}
        >
          MY TEST
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">

        {/* HEADER ROW */}
        <div className="table-head">
          <span>Rank</span>
          <span>Name</span>
          <span>User ID</span>
          <span>Score</span>
          <span>Time</span>
        </div>

        {/* EMPTY STATE */}
        {leaders.length === 0 ? (
          <div className="empty-row">
            Results will be declared at <b>7 PM</b>
          </div>
        ) : (
          leaders.map((item, index) => {
            const min = Math.floor(item.timeTaken / 60);
            const sec = item.timeTaken % 60;

            return (
              <div className="table-row" key={item._id}>
                <span>#{index + 1}</span>
                <span>{item.user?.fullName || "—"}</span>
                <span>{item.user?.userId || "—"}</span>
                <span>{item.score}</span>
                <span>{min}m {sec}s</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
