import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MoodLogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);

  useEffect(() => {
    api
      .get(`/moodlogs/${id}`)
      .then((res) => setLog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    await api.delete(`/moodlogs/${id}`);
    navigate("/mood_logs");
  };

  if (!log) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mood {log.mood_value}/10</h1>
      <p>{log.notes}</p>
      <p>Logged at: {formatDate(log.created_at)}</p>

      <Link to={`/mood_logs/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>

      <br />
      <Link to="/mood_logs">Back</Link>
    </div>
  );
}
