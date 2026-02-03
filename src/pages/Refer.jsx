import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/refer.css";

function Refer() {
  const navigate = useNavigate();
  const [refCode, setRefCode] = useState("");
  const WEBSITE_LINK = "https://earnaco.com";

  useEffect(() => {
    const loadReferral = async () => {
      const res = await API.get("/auth/me");
      setRefCode(res.data.referralCode);
    };
    loadReferral();
  }, []);

  const shareMessage = `Earnaco 🪙
Learn • Play • Win Coins
Use my referral code:
${refCode}
🎁 You get 1 Coin
🎁 I get 1 Coin
Join now 👇
${WEBSITE_LINK}/register?ref=${refCode}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(shareMessage);
    alert("Referral message copied 🪙");
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const shareInstagram = async () => {
    await copyCode();
    window.open("https://www.instagram.com/direct/inbox/", "_blank");
  };

  return (
    <div className="refer-screen">

      {/* HEADER */}
      <div className="refer-header">
        <i className="material-icons" onClick={() => navigate(-1)}>
          arrow_back
        </i>
        <span>Refer & Earn</span>
      </div>

      {/* MAIN CARD */}
      <div className="refer-card">

        {/* BANNER */}
        <img
          src="/assets/refer-banner.png"
          alt="Refer & Earn"
          className="refer-banner"
        />

        <h2>Invite Friends & Earn Coins 🪙</h2>
        <p className="subtitle">
          Share your referral code and earn coins when your friend joins.
        </p>

        {/* REWARD */}
        <div className="reward-box">
          <div>
            <span>🪙</span>
            <p>You earn</p>
            <strong>1 Coin</strong>
          </div>
          <div>
            <span>🪙</span>
            <p>Friend earns</p>
            <strong>1 Coin</strong>
          </div>
        </div>

        {/* CODE */}
        <div className="ref-code">
          <span>{refCode}</span>
          <button onClick={copyCode}>Copy</button>
        </div>

        {/* SHARE */}
        <button className="whatsapp-btn" onClick={shareWhatsApp}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt=""
          />
          Share on WhatsApp
        </button>

        <button className="insta-btn" onClick={shareInstagram}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt=""
          />
          Share on Instagram
        </button>

        <p className="note">
          ⚠ Coins are virtual and can be used to join contests only.
        </p>
      </div>
    </div>
  );
}

export default Refer;