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
    <div className="screen">
      <i
        className="material-icons"
        onClick={() => navigate("/entry")}
        style={{ cursor: "pointer" }}
      >
        arrow_back
      </i>

      {/* HEADER */}
      <div className="coupon-header">
        <div
          className="header-item"
          onClick={() => navigate(`/contest/${contestId}`)}
        >
          CONTEST
        </div>
        <div className="header-item">LEADERBOARD</div>
        <div
          className="header-item"
          onClick={() => navigate("/my-test")}
        >
          MY TEST
        </div>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Score</th>
            <th>Time</th>
            {/* Optional */}
            {/* <th>Reward 🪙</th> */}
          </tr>
        </thead>

        <tbody>
          {leaders.length === 0 ? (
            <tr>
              <td colSpan="5">Results will be declared at 7 PM</td>
            </tr>
          ) : (
            leaders.map((item, index) => {
              const minutes = Math.floor(item.timeTaken / 60);
              const seconds = item.timeTaken % 60;

              return (
                <tr key={item._id}>
                  <td>#{index + 1}</td>
                  <td>{item.user?.fullName || "—"}</td>
                  <td>{item.user?.userId || "—"}</td>
                  <td>{item.score}</td>
                  <td>
                    {minutes}m {seconds}s
                  </td>

                  {/* Optional Coin Reward */}
                  {/* <td>{item.reward || 0} 🪙</td> */}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
