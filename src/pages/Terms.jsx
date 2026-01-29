import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="screen legal">
      <i className="material-icons" onClick={() => navigate(-1)}>
        arrow_back
      </i>

      <h2>Terms & Conditions</h2>
      <p><b>Last updated:</b> {new Date().toDateString()}</p>

      <h4>1. Eligibility</h4>
      <p>
        You must be 18 years or older to use Earnaco. Only one account per user
        is allowed.
      </p>

      <h4>2. Nature of Platform</h4>
      <p>
        Earnaco is a skill-based learning and contest platform. All coins are
        virtual and have no real-world monetary value.
      </p>

      <h4>3. Virtual Coins</h4>
      <ul>
        <li>Coins are virtual and non-withdrawable</li>
        <li>Coins are used to join contests or unlock features</li>
        <li>Coins may be earned via ads, referrals, or promotions</li>
      </ul>

      <h4>4. Payments</h4>
      <p>
        Payments are processed via Razorpay. Purchases are for virtual coins only
        and are non-refundable.
      </p>

      <h4>5. Prohibited Activities</h4>
      <ul>
        <li>Multiple accounts</li>
        <li>Bot usage or automation</li>
        <li>Referral abuse</li>
      </ul>

      <h4>6. Account Suspension</h4>
      <p>
        Earnaco reserves the right to suspend or terminate accounts violating
        these terms.
      </p>

      <h4>7. Governing Law</h4>
      <p>These terms are governed by the laws of India.</p>

      <p>📧 support@earnaco.com</p>
    </div>
  );
}

export default Terms;
