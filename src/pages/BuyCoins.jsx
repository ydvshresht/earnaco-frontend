import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/addMoney.css"; // reuse same css

function BuyCoins() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);

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
     LOAD RAZORPAY
  ===================== */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  /* =====================
     BUY COINS
  ===================== */
  const buyCoins = async (coinPack) => {
    try {
      setLoading(true);
      await loadRazorpay();

      // 1️⃣ Create order from backend
      const { data } = await API.post("/payments/buy-coins", {
        coins: coinPack
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        order_id: data.orderId,
        amount: data.amount,
        currency: "INR",
        name: "Earnaco Coins",
        description: `${coinPack} Coins`,
        handler: async function (response) {
          // 2️⃣ Verify payment
          await API.post("/payments/verify-coin-payment", response);

          alert("Coins added successfully 🪙");
          const updated = await API.get("/wallet");
          setCoins(updated.data.coins);
          navigate("/wallet");
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
  alert(err.response?.data?.msg || "Payment failed");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-screen">

      {/* BACK */}
      <i
        className="material-icons back-btn"
        onClick={() => navigate("/wallet")}
      >
        arrow_back
      </i>

      {/* TITLE */}
      <h1 className="buy-title">Buy Coins</h1>

      {/* COINS INFO */}
      <div className="coin-info">
        Your Coins: <span>🪙 {coins}</span>
      </div>

      {/* COIN IMAGE */}
      <div className="coin-stack">
        🪙🪙🪙
      </div>

      {/* PACKS */}
      <div className="pack" onClick={() => buyCoins(50, 29)}>
        <span>₹29</span>
        <span>–</span>
        <span>50 🪙</span>
      </div>

      <div className="pack" onClick={() => buyCoins(120, 59)}>
        <span>₹59</span>
        <span>–</span>
        <span>120 🪙</span>
      </div>

      <div className="pack" onClick={() => buyCoins(250, 99)}>
        <span>₹99</span>
        <span>–</span>
        <span>250 🪙</span>
      </div>

      {/* INFO */}
      <ul className="info-list">
        <li>Coins are virtual and non-withdrawable</li>
        <li>Coins can be used to join contests</li>
        <li>Secure payment via Razorpay</li>
      </ul>

      
    </div>
  );
}

export default BuyCoins;