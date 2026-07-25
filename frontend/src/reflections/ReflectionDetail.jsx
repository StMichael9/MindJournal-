import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function ReflectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState(null);

  useEffect(() => {
    api.get(`/reflections/${id}`).then((res) => {
      setReflection(res.data);
    });
  }, [id]);

  const handleDelete = async () => {
    await api.delete(`/reflections/${id}`);
    navigate("/reflections");
  };

  if (!reflection) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{reflection.title}</h1>
      <p>{reflection.content}</p>

      <Link to={`/reflections/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>

      <br />
      <Link to="/reflections">Back</Link>
    </div>
  );
}
