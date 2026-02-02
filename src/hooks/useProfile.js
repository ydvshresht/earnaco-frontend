import { useEffect, useState } from "react";
import API from "../api/api";

const DEFAULT_PHOTO =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function useProfile() {
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/me");

        if (res.data.profilePhoto?.startsWith("http")) {
          setPhoto(res.data.profilePhoto);
        } else {
          setPhoto(DEFAULT_PHOTO);
        }

      } catch {
        setPhoto(DEFAULT_PHOTO);
      }
    };

    loadProfile();
  }, []);

  return { photo };
}
