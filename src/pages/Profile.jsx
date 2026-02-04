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
console.log(req.file);

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

        const res = await API.put("/profile/photo", data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});


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
    <div className="screen">
      {/* HEADER */}
      <div className="icon-text">
        <i
          className="material-icons"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          arrow_back
        </i>
        Personal Details
      </div>

      {/* PROFILE PHOTO */}
      <div className="profile-header">
        <div className="photo-section">
          <label htmlFor="imageUpload">
            <img src={photo} alt="Profile" />
          </label>

          <input
            type="file"
            id="imageUpload"
            name="photo"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="dob">DOB</label>
        <input
          id="dob"
          name="dob"
          type="date"
          autoComplete="bday"
          value={form.dob}
          onChange={handleChange}
        />

        <label htmlFor="mobile">Mobile</label>
        <input
          id="mobile"
          name="mobile"
          autoComplete="tel"
          inputMode="numeric"
          value={form.mobile}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          autoComplete="email"
          value={form.email}
          disabled
        />

       <fieldset className="gender">
  <legend>Gender</legend>

  {["male", "female", "other"].map((g) => (
    <div key={g}>
      <input
        type="radio"
        id={`gender-${g}`}
        name="gender"
        checked={form.gender === g}
        onChange={() =>
          setForm({ ...form, gender: g })
        }
      />
      <label htmlFor={`gender-${g}`}>
        {g.toUpperCase()}
      </label>
    </div>
  ))}
</fieldset>

        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
