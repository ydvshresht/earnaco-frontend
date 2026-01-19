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
        const res = await API.get("/wallet/transactions");
        setHistory(res.data);
      } catch {
        alert("Failed to load transactions");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container">
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate("/wallet")}
        >
          arrow_back
        </i>
        Transaction
      </div>

      {history.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        history.map((item) => {
          const isDeposit =
            item.type === "deposit" ||
            item.type === "prize";

          return (
            <div className="balance" key={item._id}>
              
              {/* TYPE */}
              <div
                className={`left-type ${
                  isDeposit ? "added" : "withdraw"
                }`}
              >
                {isDeposit ? "Deposited" : "Withdraw"}
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
                    : item.status === "success"
                    ? "success"
                    : "failed"
                }`}
              >
                {item.status.toUpperCase()}
              </div>

              {/* AMOUNT */}
              <div
                className={`amount ${
                  isDeposit ? "added" : "withdraw"
                }`}
              >
                {isDeposit ? "+" : "-"}₹{item.amount}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Transactions;
