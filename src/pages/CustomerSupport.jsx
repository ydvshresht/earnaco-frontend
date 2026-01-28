import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/support.css";

function CustomerSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const loadTickets = async () => {
    const res = await API.get("/support/my");
    setTickets(res.data);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const submitTicket = async () => {
    if (!subject || !message) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/support", { subject, message });
      setSubject("");
      setMessage("");
      alert("Support ticket submitted");
      loadTickets();
    } catch {
      alert("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
        <div className="icon-text"><i className="material-icons" onClick={() => navigate("/profile")}>arrow_back</i>
      Customer Support</div>

      {/* NEW TICKET */}
      <div className="card">
        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Describe your issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={submitTicket} disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </div>

      {/* MY TICKETS */}
      <h3>My Tickets</h3>

      {tickets.length === 0 ? (
        <p>No support tickets yet</p>
      ) : (
        tickets.map((t) => (
          <div className="ticket" key={t._id}>
            <h4>{t.subject}</h4>
            <p>{t.message}</p>

            <span className={`status ${t.status}`}>
              {t.status.toUpperCase()}
            </span>

            {t.reply && (
              <div className="reply">
                <strong>Support Reply:</strong>
                <p>{t.reply}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CustomerSupport;
