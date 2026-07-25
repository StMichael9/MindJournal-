import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TagAssign({ reflection, onUpdate }) {
  const [allTags, setAllTags] = useState([]);
  const [assigned, setAssigned] = useState(reflection.tags || []);

  useEffect(() => {
    api.get("/tags").then((res) => setAllTags(res.data));
  }, []);

  useEffect(() => {
    setAssigned(reflection.tags || []);
  }, [reflection]);

  const attachTag = async (tagId) => {
    await api.post(`/tags/${tagId}/attach/${reflection.id}`);
    const tag = allTags.find((t) => t.id === tagId);
    setAssigned([...assigned, tag]);
    onUpdate?.();
  };

  const detachTag = async (tagId) => {
    await api.delete(`/tags/${tagId}/detach/${reflection.id}`);
    setAssigned(assigned.filter((t) => t.id !== tagId));
    onUpdate?.();
  };

  return (
    <div className="tag-manager">
      <div className="tag-manager__section">
        <h3>Tags on this reflection</h3>

        {assigned.length === 0 ? (
          <p className="muted-copy">No tags assigned yet.</p>
        ) : (
          <div className="tag-row">
            {assigned.map((tag) => (
              <span
                key={tag.id}
                className="tag-pill tag-pill--attached"
                style={{
                  borderColor: tag.color || "var(--border)",
                  color: tag.color || "inherit",
                }}
              >
                {tag.title}
                <button
                  type="button"
                  className="tag-pill__remove"
                  onClick={() => detachTag(tag.id)}
                >
                  Remove
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="tag-manager__section">
        <h3>Add tag</h3>

        <div className="tag-row">
          {allTags
            .filter((t) => !assigned.some((a) => a.id === t.id))
            .map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="tag-pill tag-pill--button"
                style={{
                  borderColor: tag.color || "var(--border)",
                  color: tag.color || "inherit",
                }}
                onClick={() => attachTag(tag.id)}
              >
                {tag.title}
                <span className="tag-pill__plus">Add</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
