import { useNavigate } from "react-router-dom";
import "../styles/refer.css";

function Refer() {
  const navigate = useNavigate();

  const WEBSITE_LINK = "https://earnaco.com";

  // CLEAN MESSAGE (USED EVERYWHERE)
  const shareMessage = `Earnaco

Learn • Grow • Earn

Join here:
${WEBSITE_LINK}`;

  const openInstagram = async () => {
    await navigator.clipboard.writeText(shareMessage);
    alert("Message copied. Paste it on Instagram and attach the image.");
    window.open("https://www.instagram.com/direct/inbox/", "_blank");
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  return (
    <div className="screen">
      {/* HEADER */}
      <div className="icon-text">
        <i className="material-icons" onClick={() => navigate(-1)}>
          arrow_back
        </i>
        <span>Refer & Earn</span>
      </div>

      <div className="refer-container">
        {/* POSTER */}
        <img
          src="/assets/refer-banner.jpeg"
          alt="Earnaco Referral"
          className="refer-banner"
        />

        {/* WHATSAPP */}
        <button className="whatsapp-btn" onClick={openWhatsApp}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
          />
          Share on WhatsApp
        </button>

        {/* INSTAGRAM */}
        <button className="insta-btn" onClick={openInstagram}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
          />
          Share on Instagram
        </button>
      </div>
    </div>
  );
}

export default Refer;
