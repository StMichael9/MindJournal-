import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import TagAssign from "../tags/TagAssign";
import { formatApiDate } from "../utils/date";

export default function ReflectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState(null);

  const fetchReflection = () => {
    api.get(`/reflections/${id}`).then((res) => {
      setReflection(res.data);
    });
  };

  useEffect(() => {
    fetchReflection();
  }, [id]);

  const handleDelete = async () => {
    await api.delete(`/reflections/${id}`);
    navigate("/reflections");
  };

  if (!reflection)
    return (
      <section className="page">
        <p className="loading-state">Loading reflection...</p>
      </section>
    );

  return (
    <section className="page page-narrow">
      <article className="panel panel-reading">
        <div className="panel__header">
          <div>
            <div className="eyebrow">Reflection</div>
            <h1>{reflection.title}</h1>
            <p className="page-lead">
              Created {formatApiDate(reflection.created_at)}
            </p>
          </div>
          <div className="actions-row">
            <Link
              to={`/reflections/${id}/edit`}
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

        <p className="reading-copy">{reflection.content}</p>

        <div className="section-divider" />

        <TagAssign reflection={reflection} onUpdate={fetchReflection} />

        <div className="panel__footer">
          <Link to="/reflections" className="nav-link">
            Back to reflections
          </Link>
        </div>
      </article>
    </section>
  );
}
