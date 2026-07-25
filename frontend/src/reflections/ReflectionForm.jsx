import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

// Hardcoded prompts — IDs must match rows that actually exist in your
// reflection_prompt table (check via your seed script / DB directly).
const PROMPTS = [
  { id: 1, text: "What are you thinking about today?" },
  { id: 2, text: "What went well today?" },
  { id: 3, text: "What's on your mind?" },
];

export default function ReflectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [error, setError] = useState(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      api.get(`/reflections/${id}`).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        if (res.data.reflection_prompt_id) {
          setPromptId(res.data.reflection_prompt_id);
        }
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      content,
      reflection_prompt_id: promptId,
    };

    try {
      if (isEditing) {
        await api.patch(`/reflections/${id}`, payload);
      } else {
        await api.post("/reflections", payload);
      }
      navigate("/reflections");
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
          <div className="eyebrow">Reflection entry</div>
          <h1>{isEditing ? "Edit Reflection" : "New Reflection"}</h1>
          <p className="page-lead">
            Use a prompt to frame your thoughts before you write.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="journal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short name for this moment"
            />
          </label>

          <label className="field">
            <span>Prompt</span>
            <select
              value={promptId}
              onChange={(e) => setPromptId(Number(e.target.value))}
            >
              {PROMPTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.text}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Reflection</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your reflection..."
              rows="10"
            />
          </label>

          <div className="actions-row">
            <button type="submit" className="button button-primary">
              {isEditing ? "Save Changes" : "Create Reflection"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
