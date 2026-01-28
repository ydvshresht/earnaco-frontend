import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/addMoney.css";

function AddMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const fetchWallet = async () => {
      const res = await API.get("/wallet");
      setWallet(res.data.balance);
    };
    fetchWallet();
  }, []);

  // ➕ Quick add
  const addQuick = (value) => {
    setAmount((prev) => String(Number(prev || 0) + value));
  };

  // 🔢 Keypad
  const pressNum = (num) => {
    setAmount((prev) => (prev + num).replace(/^0+/, ""));
  };

  const deleteNum = () => {
    setAmount((prev) => prev.slice(0, -1));
  };
/* ======================
      RAZORPAY LOGIC
  ====================== */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const addMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await loadRazorpay();

       const {data} = await API.post("/payments/create-order",{amount});

      const options = {
         key:import.meta.env.VITE_RAZORPAY_KEY,
         order_id:data.id,
        amount:data.amount,
        currency: "INR",
        name: "WinTest",
        description: "Wallet Recharge",
        handler: async function (response) {
          // 2️⃣ Verify payment
          await API.post(
            "/payments/verify",
            response
          );

          alert("Money added successfully");
          navigate("/wallet");
        }
      };

     new window.Razorpay(options).open();

    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div id="app">
    <div className="page">
     <div className="icon-text"> <i className="material-icons" onClick={() => navigate("/wallet")}>arrow_back</i>
</div>
      <h1>Add Money</h1>

      <div className="available">
        Balance: ₹{wallet}
      </div>

      <div className="amount-display">
        ₹{amount || 0}
      </div>

      {/* QUICK BUTTONS */}
      <div className="quick-buttons">
        <button onClick={() => addQuick(100)}>+ ₹100</button>
        <button onClick={() => addQuick(500)}>+ ₹500</button>
        <button onClick={() => addQuick(1000)}>+ ₹1000</button>
      </div>

      {/* BANK */}
      <div className="bank-crd">
        <img
          src="https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-icon.png"
          alt="Bank"
          className="bank-logo"
        />
        <div>BANK OF BARODA ••••0388</div>
        <div>›</div>
      </div>

      {/* KEYPAD */}
      <div className="keypad">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button key={n} onClick={() => pressNum(n)}>
            {n}
          </button>
        ))}
        <button onClick={() => pressNum(0)}>0</button>
        <button className="delete" onClick={deleteNum}>⌫</button>
      </div>

      <button className="addmoney-btn" onClick={addMoney}>
        Add Money
      </button>
    </div></div>
  );
}

export default AddMoney;
