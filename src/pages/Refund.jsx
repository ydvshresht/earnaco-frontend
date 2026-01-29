import { useNavigate } from "react-router-dom";

function Refund() {
  const navigate = useNavigate();

  return (
    <div className="screen legal">
      <i className="material-icons" onClick={() => navigate(-1)}>
        arrow_back
      </i>

      <h2>Refund & Cancellation Policy</h2>

      <p>
        All purchases on Earnaco are for virtual coins.
      </p>

      <ul>
        <li>Coins once credited are non-refundable</li>
        <li>Coins cannot be converted to cash</li>
        <li>Failed payments are auto-reversed by Razorpay</li>
      </ul>

      <p>
        Please ensure you understand the coin system before making a purchase.
      </p>
    </div>
  );
}

export default Refund;
