import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MoodLogForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [moodValue, setMoodValue] = useState(5);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      api.get(`/moodlogs/${id}`).then((res) => {
        setMoodValue(res.data.mood_value);
        setNotes(res.data.notes || "");
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      mood_value: Number(moodValue),
      notes,
    };

    try {
      if (isEditing) {
        await api.patch(`/moodlogs/${id}`, payload);
      } else {
        await api.post("/moodlogs/", payload);
      }
      navigate("/mood_logs");
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
          <div className="eyebrow">Mood tracking</div>
          <h1>{isEditing ? "Edit Mood Log" : "New Mood Log"}</h1>
          <p className="page-lead">
            Capture a quick check-in before the details fade.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="journal-form" onSubmit={handleSubmit}>
          <label className="field" htmlFor="mood-select">
            <span>Mood level</span>
            <select
              id="mood-select"
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="notes-input">
            <span>Notes</span>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe how you're feeling..."
              rows="8"
            />
          </label>

          <div className="actions-row">
            <button type="submit" className="button button-primary">
              {isEditing ? "Save Changes" : "Create Mood Log"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
