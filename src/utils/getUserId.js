export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId; // ✅ PUBLIC 10-CHAR USER ID
  } catch (err) {
    return null;
  }
};
