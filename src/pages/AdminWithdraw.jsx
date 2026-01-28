import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
function AdminWithdraw() {
  const [list, setList] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    API.get("/admin/withdraw-requests")
      .then(res => setList(res.data))
      .catch(() => alert("Load failed"));
  }, []);

  const approve = async (id) => {
    await API.post(`/admin/approve/${id}`);
    alert("Approved");
    setList(list.filter(i => i._id !== id));
  };

  const reject = async (id) => {
    await API.post(`/admin/reject/${id}`);
    alert("Rejected");
    setList(list.filter(i => i._id !== id));
  };

  return (
    <div className="screen">
         <div className="icon-text"><i className="material-icons" onClick={() => navigate("/admin")}>arrow_back</i>
   Withdraw Requests</div>
      <h2>Withdraw Requests</h2>

      {list.map(item => (
        <div key={item._id} className="card">
          <p><b>User:</b> {item.user.fullName}</p>
          <p><b>Email:</b> {item.user.email}</p>
          <p><b>Amount:</b> ₹{item.amount}</p>

          <div className="btns"> <button onClick={() => approve(item._id)}>
            Approve
          </button>

          <button
            style={{ marginLeft: 10, background: "red" }}
            onClick={() => reject(item._id)}
          >
            Reject
          </button></div>
        </div>
      ))}
    </div>
  );
}

export default AdminWithdraw;
