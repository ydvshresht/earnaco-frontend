import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/bank.css";

function BankAutoPay() {
  const [banks, setBanks] = useState([]);
 const navigate = useNavigate();
  const loadBanks = async () => {
    const res = await API.get("/banks");
    setBanks(res.data);
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const addBank = async () => {
    const bankName = prompt("Bank Name");
    const accountNumber = prompt("Account Number");
    const ifsc = prompt("IFSC Code");

    if (!bankName || !accountNumber || !ifsc) return;

    await API.post("/banks/add", {
      bankName,
      accountNumber,
      ifsc
    });

    loadBanks();
  };

  return (
    <div className="page">
      <div className="icon-text"> <i className="material-icons" onClick={() => navigate("/profile")}>arrow_back</i>
      Bank & Autopay</div>

      <div className="banks">
        {banks.map((bank) => (
          <div className="bank-card" key={bank._id}>
            {bank.isPrimary && (
              <div className="primary-tag">PRIMARY</div>
            )}

            <img
              src="https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-icon.png"
              alt="Bank"
              className="bank-logo"
            />

            <div className="bank-name">{bank.bankName}</div>
            <div className="bank-number">
              **** **** **** {bank.accountNumber.slice(-4)}
            </div>
          </div>
        ))}

        {/* ADD BANK */}
        <div className="bank-card add-bank" onClick={addBank}>
          <span>+</span> Add new bank
        </div>
      </div>
    </div>
  );
}

export default BankAutoPay;
