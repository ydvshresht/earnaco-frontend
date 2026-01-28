import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/leaderboard.css";

function Leaderboard() {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contest");
  const navigate = useNavigate();
const [user, setUser] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchLeaderboard = async () => {
     
      try {
          const userRes = await API.get("/auth/me");
        const res = await API.get(`/results/leaderboard/${testId}`);
         setUser(userRes.data);
        setLeaders(res.data);
      }catch (err) {
  if (err.response?.status === 403) {
    alert(err.response.data.msg);
    
  } else {
    alert("Failed to load leaderboard");
      } 
      }
    };
    fetchLeaderboard();
  }, [testId]);

  

  return (
    <div className="page">
      <i className="material-icons" onClick={() => navigate("/entry")}>arrow_back</i>
     
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

      <table>
       <thead>
  <tr>
    <th>Rank</th>
    <th>Name</th>
    <th>User ID</th>
    <th>Score</th>
    <th>Time</th>
  </tr>
</thead>

       <tbody>
  {leaders.length === 0 ? (
    <tr>
      <td colSpan="5">Result declare at 7pm</td>
    </tr>
  ) : (
    leaders.map((item, index) => {
      const minutes = Math.floor(item.timeTaken / 60);
      const seconds = item.timeTaken % 60;

      return (
        <tr key={item._id}>
          <td>#{index + 1}</td>
          <td>{item.user?.fullName}</td>
          <td>{item.user?.userId}</td>
          <td>{item.score}</td>

          {/* ✅ TIME TAKEN */}
          <td>
            {minutes}m {seconds}s
          </td>
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
