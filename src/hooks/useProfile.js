import { useEffect, useState } from "react";
import API from "../api/api";

export default function useProfile() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  useEffect(() => {
    const load = async () => {
      const res = await API.get("/auth/me");
      setUser(res.data);

      if (res.data.profilePhoto) {
        setPhoto(`http://localhost:5000${res.data.profilePhoto}`);
      }
    };

    load();
  }, []);

  return { user, photo };
}
