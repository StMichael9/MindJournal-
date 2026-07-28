import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TagForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#000000");
  const [error, setError] = useState(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      api.get(`/tags/${id}`).then((res) => {
        setTitle(res.data.title);
        setColor(res.data.color || "#000000");
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = { title, color };

    try {
      if (isEditing) {
        await api.patch(`/tags/${id}`, payload);
      } else {
        await api.post("/tags", payload);
      }
      navigate("/tags");
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : err.response?.data?.error ||
              "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section className="page page-narrow">
      <div className="panel">
        <div className="panel__header panel__header--stacked">
          <div className="eyebrow">Tag library</div>
          <h1>{isEditing ? "Edit Tag" : "New Tag"}</h1>
          <p className="page-lead">
            Add a simple label to help you group reflections by theme.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="journal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tag title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Growth, gratitude, confidence..."
            />
          </label>

          <label className="field field--inline">
            <span>Color</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>

          <div className="actions-row">
            <button type="submit" className="button button-primary">
              {isEditing ? "Save Changes" : "Create Tag"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
