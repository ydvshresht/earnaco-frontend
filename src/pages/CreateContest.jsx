import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateContest() {
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxSpots, setMaxSpots] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/tests").then(res => setTests(res.data));
  }, []);

  const createContest = async () => {
    await API.post("/contests", {
      test,
      prizePool,
      entryFee,
      maxSpots
    });
    navigate("/admin/manage-contests");
  };

  return (
    <div className="container">
      <h3>Create Contest</h3>

      <select onChange={(e) => setTest(e.target.value)}>
        <option value="">Select Test</option>
        {tests.map(t => (
          <option key={t._id} value={t._id}>
            {t.testName}
          </option>
        ))}
      </select>

      <input
        placeholder="Prize Pool"
        value={prizePool}
        onChange={(e) => setPrizePool(e.target.value)}
      />

      <input
        placeholder="Entry Fee"
        value={entryFee}
        onChange={(e) => setEntryFee(e.target.value)}
      />

      <input
        placeholder="Max Spots"
        value={maxSpots}
        onChange={(e) => setMaxSpots(e.target.value)}
      />

      <button onClick={createContest}>Create Contest</button>
    </div>
  );
}

export default CreateContest;
