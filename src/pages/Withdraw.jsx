import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/withdraw.css";

function Withdraw() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState(0);
  const [upi, setUpi] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      const res = await API.get("/wallet");
      setWallet(res.data.balance);
    };
    fetchWallet();
  }, []);

  const pressNum = (num) => {
    setAmount((prev) => (prev + num).replace(/^0+/, ""));
  };

  const deleteNum = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const withdrawMoney = async () => {
    if (!amount || !upi) {
      alert("Enter amount and UPI");
      return;
    }

    try {
      const res = await API.post("/wallet/withdraw", {
        amount,
        upi
      });

      alert(res.data.msg);
      navigate("/wallet");

    } catch (err) {
      alert(err.response?.data?.msg || "Withdraw failed");
    }
  };

  return (
    <div className="screen">
      <i
        className="material-icons"
        onClick={() => navigate("/wallet")}
      >
        arrow_back
      </i>

      <h1>Withdraw</h1>

      <div className="available">
        Balance: ₹{wallet}
      </div>

      <div className="amount-display">
        ₹{amount || 0}
      </div>

      {/* UPI INPUT */}
      <input
        type="text"
        placeholder="Enter UPI ID (example@upi)"
        value={upi}
        onChange={(e) => setUpi(e.target.value)}
        className="upi-input"
      />

      {/* KEYPAD */}
      <div className="keypad">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button key={n} onClick={() => pressNum(n)}>
            {n}
          </button>
        ))}
        <button onClick={() => pressNum(0)}>0</button>
        <button className="delete" onClick={deleteNum}>
          ⌫
        </button>
      </div>

      <button className="withdraw-btn" onClick={withdrawMoney}>
        Withdraw
      </button>
    </div>
  );
}


export default Withdraw;
