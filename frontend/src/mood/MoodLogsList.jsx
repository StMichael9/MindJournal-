import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { formatApiDate } from "../utils/date";

export default function MoodLogsList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api
      .get("/moodlogs/")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Mood tracking</div>
          <h1>Your mood logs</h1>
          <p className="page-lead">
            Quick entries that help you see emotional patterns over time.
          </p>
        </div>

        <Link to="/mood_logs/new" className="button button-primary">
          New mood log
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <h2>No mood logs yet</h2>
          <p>
            Log your first mood to start building a clearer picture of your
            week.
          </p>
        </div>
      ) : (
        <ul className="card-list">
          {logs.map((log) => (
            <li key={log.id} className="card-list__item">
              <Link to={`/mood_logs/${log.id}`} className="list-card">
                <div className="list-card__body">
                  <h2>Mood {log.mood_value}/10</h2>
                  <p className="muted-copy">{formatApiDate(log.created_at)}</p>
                </div>
                <span className="list-card__action">Open</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
