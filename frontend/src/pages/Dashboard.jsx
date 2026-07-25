import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <p>
        You are logged in as: <strong>{user?.email}</strong>
      </p>
    </div>
  );
}
