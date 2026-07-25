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
    <div style={{ padding: "2rem" }}>
      <h1>{isEditing ? "Edit Reflection" : "New Reflection"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reflection..."
        />

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

        <button type="submit">
          {isEditing ? "Save Changes" : "Create Reflection"}
        </button>
      </form>
    </div>
  );
}
