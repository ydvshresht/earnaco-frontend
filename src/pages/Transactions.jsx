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
    <div className="screen">
      {/* HEADER */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/wallet")}
        >
          arrow_back
        </i>
        Transactions
      </div>

      {/* EMPTY STATE */}
      {history.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          No transactions yet
        </p>
      ) : (
        history.map((item) => {
          const isCredit = item.type === "credit";
          const coins = Number(item.coins) || 0;

          return (
            <div className="balance" key={item._id}>
              {/* TYPE */}
              <div
                className={`left-type ${
                  isCredit ? "added" : "withdraw"
                }`}
              >
                {isCredit ? "Added" : "Deducted"}
              </div>

              {/* DATE */}
              <div className="left-date">
                {new Date(item.createdAt).toLocaleString()}
              </div>

              {/* STATUS */}
              <div
                className={`status ${
                  item.status === "pending"
                    ? "pending"
                    : item.status === "failed"
                    ? "failed"
                    : "success"
                }`}
              >
                {(item.status || "success").toUpperCase()}
              </div>

              {/* AMOUNT */}
              <div
                className={`amount ${
                  isCredit ? "added" : "withdraw"
                }`}
              >
                {isCredit ? "+" : "-"}🪙{coins}
              </div>

              {/* REASON */}
              {item.reason && (
                <div className="txn-reason">
                  {item.reason}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Transactions;
