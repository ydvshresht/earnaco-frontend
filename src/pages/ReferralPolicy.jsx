import { useNavigate } from "react-router-dom";

function ReferralPolicy() {
  const navigate = useNavigate();

  return (
    <div className="screen legal">
      <i className="material-icons" onClick={() => navigate(-1)}>
        arrow_back
      </i>

      <h2>Referral Policy</h2>

      <ul>
        <li>Each user gets a unique referral code</li>
        <li>Referrer and friend both get 1 virtual coin</li>
        <li>Referral reward is granted once per user</li>
        <li>Self-referrals are strictly prohibited</li>
      </ul>

      <p>
        Earnaco reserves the right to revoke referral rewards if misuse is
        detected.
      </p>
    </div>
  );
}

export default ReferralPolicy;
