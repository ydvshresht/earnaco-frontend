import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/wallet.css";

function Wallet() {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet");
        setBalance(res.data.balance);
      } catch {
        alert("Failed to load wallet");
      }
    };

    fetchWallet();
  }, []);

  return (
    <div className="page">
      {/* BACK */}
    <i className="material-icons" onClick={() => navigate("/entry")}>arrow_back</i>
      <h1>My Wallet</h1>

      {/* BALANCE */}
      <div className="balanc">₹{balance}</div>
      <div className="balance-text">Balance</div>

      {/* DEPOSIT */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box"> <i className="material-icons">savings</i></div>
          <div>
            <div className="text-title">Deposit</div>
            <div className="sub-text">Add money to wallet</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/add-money")}
        >
          Add Money
        </button>
      </div>

      {/* WINNINGS */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box"> <i className="material-icons">military_tech</i></div>
          <div>
            <div className="text-title">Winnings</div>
            <div className="sub-text">Withdraw winnings</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/withdraw")}
        >
          Withdraw
        </button>
      </div>

      {/* PROMOTIONAL */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box"> <i className="material-icons">celebration</i></div>
          <div>
            <div className="text-title">Promotional</div>
            <div className="sub-text">Refer to friends</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/refer")}
        >
          Refer & Earn
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-title">Quick Actions</div>

      <div
        className="quick-card"
        onClick={() => navigate("/transactions")}
      >
        <div className="left-part">
          <div className="quick-icon"> <i className="material-icons">receipt_long</i></div>
          <div>
            <div className="text-title">Transaction History</div>
            <div className="sub-text">
              for all balance debit & credits
            </div>
          </div>
        </div>
        <div>›</div>
      </div>
    </div>
  );
}

export default Wallet;
