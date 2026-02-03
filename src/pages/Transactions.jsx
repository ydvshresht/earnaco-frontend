import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/transaction.css";

function Transactions() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/transactions");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load transactions");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="txn-screen">

      {/* HEADER */}
      <div className="txn-header">
        <i
          className="material-icons"
          onClick={() => navigate("/wallet")}
        >
          arrow_back
        </i>
        <span>Transactions</span>
      </div>

      {/* EMPTY */}
      {history.length === 0 ? (
        <p className="empty">No transactions yet</p>
      ) : (
        history.map(item => {
          const credit = item.type === "credit";

          return (
            <div className="txn-card" key={item._id}>
              <div className="txn-left">
                <h3 className={credit ? "added" : "deducted"}>
                  {credit ? "Added" : "Deducted"}
                </h3>

                <p className="date">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <p className="status success">
                  {(item.status || "success").toUpperCase()}
                </p>

                <p className="reason">{item.reason}</p>
              </div>

              <div
                className={`txn-amount ${
                  credit ? "added" : "deducted"
                }`}
              >
                {credit ? "+" : "-"}🪙{item.coins}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Transactions;