import { useNavigate } from "react-router-dom";

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="screen legal">
      <i className="material-icons" onClick={() => navigate(-1)}>
        arrow_back
      </i>

      <h2>Privacy Policy</h2>

      <p>
        Earnaco respects your privacy and is committed to protecting your data.
      </p>

      <h4>Information We Collect</h4>
      <ul>
        <li>Name, email, profile details</li>
        <li>Login and usage activity</li>
        <li>Transaction references (no card/UPI details)</li>
      </ul>

      <h4>What We Do Not Store</h4>
      <ul>
        <li>Card numbers</li>
        <li>UPI PINs</li>
        <li>Bank passwords</li>
      </ul>

      <h4>Data Usage</h4>
      <p>
        Data is used for authentication, fraud prevention, contests, and
        support.
      </p>

      <h4>Third-Party Services</h4>
      <p>
        We use Razorpay for payments and Google services for authentication.
      </p>

      <p>Your data is never sold.</p>
    </div>
  );
}

export default Privacy;
