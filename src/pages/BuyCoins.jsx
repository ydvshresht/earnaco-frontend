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
    <div className="screen">
      {/* BACK */}
      <i
        className="material-icons"
        onClick={() => navigate("/wallet")}
      >
        arrow_back
      </i>

      <h1>Buy Coins</h1>

      {/* BALANCE */}
      <div className="available">
        Your Coins: 🪙 {coins}
      </div>

      {/* COIN PACKS */}
      <div className="quick-buttons">
        <button onClick={() => buyCoins(50)} disabled={loading}>
          ₹29 → 50 🪙
        </button>
        <button onClick={() => buyCoins(120)} disabled={loading}>
          ₹59 → 120 🪙
        </button>
        <button onClick={() => buyCoins(250)} disabled={loading}>
          ₹99 → 250 🪙
        </button>
      </div>

      {/* INFO */}
      <div style={{ marginTop: "20px", fontSize: "13px", opacity: 0.7 }}>
        • Coins are virtual and non-withdrawable  
        <br />
        • Coins can be used to join contests  
        <br />
        • Secure payment via Razorpay
      </div>
    </div>
  );
}

export default BuyCoins;
