import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { formatApiDate } from "../utils/date";

export default function ReflectionsList() {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    api.get("/reflections").then((res) => {
      setReflections(res.data);
    });
  }, []);

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Timeline</div>
          <h1>Your reflections</h1>
          <p className="page-lead">
            A simple archive of what you were thinking and feeling.
          </p>
        </div>
        <Link to="/reflections/new" className="button button-primary">
          New reflection
        </Link>
      </div>

      {reflections.length === 0 ? (
        <div className="empty-state">
          <h2>No reflections yet</h2>
          <p>Start with a prompt and build your first entry.</p>
        </div>
      ) : (
        <ul className="card-list">
          {reflections.map((r) => (
            <li key={r.id} className="card-list__item">
              <Link to={`/reflections/${r.id}`} className="list-card">
                <div className="list-card__body">
                  <h2>{r.title}</h2>
                  <p className="muted-copy">{formatApiDate(r.created_at)}</p>
                  {r.tags && r.tags.length > 0 && (
                    <div className="tag-row">
                      {r.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="tag-chip"
                          style={{
                            borderColor: tag.color || "var(--border)",
                            color: tag.color || "inherit",
                          }}
                        >
                          #{tag.title}
                        </span>
                      ))}
                    </div>
                  )}
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
