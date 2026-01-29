import { useNavigate } from "react-router-dom";

function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div className="screen legal">
      <i className="material-icons" onClick={() => navigate(-1)}>
        arrow_back
      </i>

      <h2>Disclaimer</h2>

      <p>
        Earnaco is not a gambling, betting, or lottery platform.
      </p>

      <ul>
        <li>All contests are skill-based</li>
        <li>Coins are virtual and non-monetary</li>
        <li>No real-money winnings are involved</li>
      </ul>

      <p>
        Performance depends on user skill and knowledge.
      </p>
    </div>
  );
}

export default Disclaimer;
