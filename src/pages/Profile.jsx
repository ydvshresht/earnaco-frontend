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
    pan: "",
    gender: ""
  });

 const [photo, setPhoto] = useState(
  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
);

useEffect(() => {
  const loadProfile = async () => {
    try {
      const res = await API.get("/auth/me");

      setForm({
        fullName: res.data.fullName || "",
        dob: res.data.dob?.slice(0, 10) || "",
        mobile: res.data.mobile || "",
        email: res.data.email || "",
        pan: res.data.pan || "",
        gender: res.data.gender || ""
      });

      if (res.data.profilePhoto?.startsWith("http")) {
        setPhoto(res.data.profilePhoto);
      }
    } catch {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    if (imageFile) {
      formData.append("profilePic", imageFile);
    }

    try {
    const res = await API.put("/auth/update-profile", formData);

if (res.data.profilePhoto?.startsWith("http")) {
  setPhoto(res.data.profilePhoto);
}

      alert("Profile saved successfully");
    } catch {
      alert("Failed to save profile");
    }
  };

  if (loading) return <h3>Loading profile...</h3>;

  return (
    <div className="page">
      <div className="icon-text">
<i className="material-icons" onClick={() => navigate(-1)}>arrow_back</i>
      Personal Details</div>

      <div className="profile-header">
        <div className="photo-section">
          <img
            src={photo}
            alt="Profile"
            onClick={() =>
              document.getElementById("imageUpload").click()
            }
          />
          <input
            type="file"
            id="imageUpload"
            hidden
            accept="image/*"
           onChange={(e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImageFile(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    setPhoto(reader.result); // ✅ mobile-safe preview
  };
  reader.readAsDataURL(file);
}}

          />
        </div>
        <div className="edit-btn">📷</div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input id="fullName" value={form.fullName} onChange={handleChange} />

        <label>Date of Birth</label>
        <input id="dob" type="date" value={form.dob} onChange={handleChange} />

        <label>Mobile</label>
        <input id="mobile" value={form.mobile} onChange={handleChange} />

        <label>Email</label>
        <input value={form.email} disabled />

        <label>PAN</label>
        <input id="pan" value={form.pan} onChange={handleChange} />

        <label>Gender</label>
        <div className="gender">
          {["male", "female", "other"].map((g) => (
            <label key={g}>
              <input
                type="radio"
                checked={form.gender === g}
                onChange={() => setForm({ ...form, gender: g })}
              />
              {g.toUpperCase()}
            </label>
          ))}
        </div>

        <button className="save-btn">Save Details</button>
        
      </form>
    </div>
  );
}

export default Profile;
