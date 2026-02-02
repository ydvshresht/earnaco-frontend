import { useEffect, useState } from "react";
import API from "../api/api";

const DEFAULT_PHOTO =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function useProfile() {
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await API.get("/profile/me");

        if (mounted && res.data.profilePhoto) {
          setPhoto(res.data.profilePhoto);
        }
      } catch {
        if (mounted) {
          setPhoto(DEFAULT_PHOTO);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return { photo };
}
