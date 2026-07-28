import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function TagsList() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api
      .get("/tags")
      .then((res) => setTags(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/tags/${id}`);
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Organization</div>
          <h1>Your tags</h1>
          <p className="page-lead">
            Color-coded labels for the ideas and themes you return to.
          </p>
        </div>

        <Link to="/tags/new" className="button button-primary">
          New tag
        </Link>
      </div>

      {tags.length === 0 ? (
        <div className="empty-state">
          <h2>No tags yet</h2>
          <p>Create a few themes like growth, gratitude, or confidence.</p>
        </div>
      ) : (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li key={tag.id} className="tag-list__item">
              <span
                className="tag-pill"
                style={{
                  borderColor: tag.color || "var(--border)",
                  color: tag.color || "inherit",
                }}
              >
                {tag.title}
              </span>
              <button
                type="button"
                className="button button-ghost button-ghost--danger"
                onClick={() => handleDelete(tag.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
