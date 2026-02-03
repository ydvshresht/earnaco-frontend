import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    gender: ""
  });

  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  /* =====================
     LOAD PROFILE
  ===================== */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/profile/me");

        setForm({
          fullName: res.data.fullName || "",
          dob: res.data.dob?.slice(0, 10) || "",
          mobile: res.data.mobile || "",
          email: res.data.email || "",
          gender: res.data.gender || ""
        });

        if (res.data.profilePhoto) {
          setPhoto(
            res.data.profilePhoto.startsWith("http")
              ? res.data.profilePhoto
              : `${import.meta.env.VITE_API_BASE_URL}${res.data.profilePhoto}`
          );
        }
      } catch {
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =====================
     FORM HANDLERS
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);

    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/profile/me", {
        fullName: form.fullName,
        dob: form.dob,
        mobile: form.mobile,
        gender: form.gender
      });

      if (imageFile) {
        const data = new FormData();
        data.append("photo", imageFile);

        const res = await API.put("/profile/photo", data);

        setPhoto(
          res.data.photo.startsWith("http")
            ? res.data.photo
            : `${import.meta.env.VITE_API_BASE_URL}${res.data.photo}`
        );
      }

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <h3>Loading...</h3>;

   return (
    <div className="profile-screen">

      {/* HEADER */}
      <div className="profile-header-bar">
        <i className="material-icons" onClick={() => navigate(-1)}>
          arrow_back
        </i>
        <span>Personal Details</span>
      </div>

      {/* PHOTO */}
      <div className="avatar-section">
        <label htmlFor="photo">
          <img src={photo} alt="profile" />
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </div>

      {/* FORM CARD */}
      <form className="profile-card" onSubmit={handleSubmit}>

        <label>Full Name</label>
        <input
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <label>DOB</label>
        <input
          type="date"
          value={form.dob}
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />

        <label>Mobile</label>
        <input
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />

        <label>Email</label>
        <input value={form.email} disabled />

        {/* GENDER */}
        <label>Gender</label>
        <div className="gender-row">
          {["male", "female", "other"].map(g => (
            <label key={g} className="radio">
              <input
                type="radio"
                checked={form.gender === g}
                onChange={() =>
                  setForm({ ...form, gender: g })
                }
              />
              <span>{g.toUpperCase()}</span>
            </label>
          ))}
        </div>

        <button className="save-btn">Save</button>
      </form>
    </div>
  );
}

export default Profile;
