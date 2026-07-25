import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

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

export default function MoodLogsList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api
      .get("/moodlogs/")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Mood Logs</h1>

      <Link to="/mood_logs/new">Create Mood Log</Link>

      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <Link to={`/mood_logs/${log.id}`}>
              Mood {log.mood_value}/10 — {formatDate(log.created_at)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
