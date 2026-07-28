import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { formatApiDate } from "../utils/date";

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

  if (!log)
    return (
      <section className="page">
        <p className="loading-state">Loading mood log...</p>
      </section>
    );

  return (
    <section className="page page-narrow">
      <article className="panel panel-reading">
        <div className="panel__header">
          <div>
            <div className="eyebrow">Mood log</div>
            <h1>Mood {log.mood_value}/10</h1>
            <p className="page-lead">
              Logged at {formatApiDate(log.created_at)}
            </p>
          </div>

          <div className="actions-row">
            <Link
              to={`/mood_logs/${id}/edit`}
              className="button button-secondary"
            >
              Edit
            </Link>
            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        <p className="reading-copy">
          {log.notes || "No notes were added for this entry."}
        </p>

        <div className="panel__footer">
          <Link to="/mood_logs" className="nav-link">
            Back to mood logs
          </Link>
        </div>
      </article>
    </section>
  );
}
