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
    <div style={{ padding: "2rem" }}>
      <h1>{isEditing ? "Edit Mood Log" : "New Mood Log"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="mood-select">Mood (1–10)</label>
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

        <label htmlFor="notes-input">Notes (optional)</label>
        <textarea
          id="notes-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe how you're feeling..."
        />

        <button type="submit">
          {isEditing ? "Save Changes" : "Create Mood Log"}
        </button>
      </form>
    </div>
  );
}
