
import { useNavigate } from "react-router-dom";
import "../styles/refer.css";

function Refer() {
  const navigate = useNavigate();

  const WEBSITE_LINK = "https://earnaco.com"; // YOUR LIVE DOMAIN

  const openInstagram = async () => {
    const message =
`🎉 Earnaco – Learn & Win 🎉

Join now and start your journey!

👉 Register here:
${WEBSITE_LINK}

🔥 Study • Compete • Win`;

    await navigator.clipboard.writeText(message);

    alert("Message copied! Paste it on Instagram & attach image 📸");

    window.open("https://www.instagram.com/direct/inbox/", "_blank");
  };

  const openWhatsApp = () => {
    const message = 
`🎉 Earnaco – Learn & Win 🎉

Join this amazing learning platform!

👉 Register here:
${WEBSITE_LINK}

🔥 Start today!`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate(-1)}
        >
          arrow_back
        </i>
        <span>Refer Friends</span>
      </div>

      <div className="refer-container">

        {/* POSTER IMAGE */}
        <img
          src="/assets/refer-banner.jpeg"
          alt="Refer Banner"
          className="refer-banner"
        />

        {/* INSTAGRAM */}
        <button className="insta-btn" onClick={openInstagram}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Insta"
          />
          Share on Instagram
        </button>

        {/* WHATSAPP */}
        <button className="whatsapp-btn" onClick={openWhatsApp}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
          />
          Share on WhatsApp
        </button>

      </div>
    </div>
  );
}

export default Refer;

