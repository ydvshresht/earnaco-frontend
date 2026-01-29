import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/wallet.css";

function Wallet() {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* =====================
     LOAD COIN BALANCE
  ===================== */
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet");
        setCoins(res.data.coins);
      } catch {
        alert("Failed to load wallet");
      }
    };
    fetchWallet();
  }, []);

  /* =====================
     BUY COINS (RAZORPAY)
  ===================== */
  const buyCoins = async (coinPack) => {
    try {
      setLoading(true);

      // backend creates razorpay order
      const { data } = await API.post("/payments/buy-coins", {
        coins: coinPack
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "Earnaco Coins",
        description: `${coinPack} Coins`,
        order_id: data.orderId,
        handler: async function (response) {
          await API.post("/payments/verify-coin-payment", response);
          alert("Coins added successfully 🪙");
          const updated = await API.get("/wallet");
          setCoins(updated.data.coins);
        }
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     WATCH AD → +1 COIN
  ===================== */
  const watchAd = async () => {
    try {
      await API.post("/wallet/watch-ad");
      alert("+1 coin added 🎉");
      setCoins((c) => c + 1);
    } catch {
      alert("Ad reward failed");
    }
  };

  return (
    <div className="screen">
      {/* BACK */}
      <i className="material-icons" onClick={() => navigate("/entry")}>
        arrow_back
      </i>

      <h1>My Coins</h1>

      {/* COIN BALANCE */}
      <div className="balance">
        🪙 {coins}
      </div>
      <div className="balance-text">Available Coins</div>

      {/* BUY COINS */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">paid</i>
          </div>
          <div>
            <div className="text-title">Buy Coins</div>
            <div className="sub-text">Use real money</div>
          </div>
        </div>
        <button
          className="action-btn"
          disabled={loading}
          onClick={() => buyCoins(50)}
        >
          Buy 50 🪙
        </button>
      </div>

      {/* WATCH AD */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">smart_display</i>
          </div>
          <div>
            <div className="text-title">Watch Ad</div>
            <div className="sub-text">Get 1 free coin</div>
          </div>
        </div>
        <button className="action-btn" onClick={watchAd}>
          Watch
        </button>
      </div>

      {/* REFER */}
      <div className="card">
        <div className="left-part">
          <div className="icon-box">
            <i className="material-icons">group</i>
          </div>
          <div>
            <div className="text-title">Refer & Earn</div>
            <div className="sub-text">Invite friends</div>
          </div>
        </div>
        <button
          className="action-btn"
          onClick={() => navigate("/refer")}
        >
          Refer
        </button>
      </div>

      {/* TRANSACTIONS */}
      <div className="section-title">Quick Actions</div>

      <div
        className="quick-card"
        onClick={() => navigate("/transactions")}
      >
        <div className="left-part">
          <div className="quick-icon">
            <i className="material-icons">receipt_long</i>
          </div>
          <div>
            <div className="text-title">Coin History</div>
            <div className="sub-text">
              All coin credits & debits
            </div>
          </div>
        </div>
        <div>›</div>
      </div>
    </div>
  );
}

export default Wallet;
