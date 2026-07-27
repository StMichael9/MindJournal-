import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import InsightsOverview from "../components/InsightsOverview";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <section className="page page-home">
      <div className="hero-card">
        <div className="eyebrow">Private reflection workspace</div>
        <h1>Welcome back</h1>
        <p className="hero-copy">
          A calm place to journal with intention, track your mood, and spot the
          patterns that matter.
        </p>
        <p className="hero-meta">
          Signed in as <strong>{user?.email}</strong>
        </p>
        <div className="hero-actions">
          <Link to="/reflections/new" className="button button-primary">
            New Reflection
          </Link>
          <Link to="/mood_logs/new" className="button button-secondary">
            Log Mood
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>Guided writing</h2>
          <p>
            Use prompts to write with purpose instead of staring at a blank
            page.
          </p>
        </article>
        <article className="feature-card">
          <h2>Fast mood tracking</h2>
          <p>
            Capture how you feel in a few taps and revisit the changes later.
          </p>
        </article>
        <article className="feature-card">
          <h2>Simple insights</h2>
          <p>
            Review your week with clear summaries that stay focused and useful.
          </p>
        </article>
      </div>

      <InsightsOverview />
    </section>
  );
}
