import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function ReflectionsList() {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    api.get("/reflections").then((res) => {
      setReflections(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Reflections</h1>

      <Link to="/reflections/new">Create New Reflection</Link>

      <ul>
        {reflections.map((r) => (
          <li key={r.id}>
            <Link to={`/reflections/${r.id}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
