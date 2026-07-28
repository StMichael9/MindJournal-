import { useEffect, useState } from "react";
import api from "../api/axios";

export default function InsightsOverview() {
  const [reflections, setReflections] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, moodRes] = await Promise.all([
          api.get("/reflections"),
          api.get("/moodlogs"),
        ]);
        setReflections(refRes.data);
        setMoodLogs(moodRes.data);
      } catch (e) {
        console.error("Insights fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReflections = reflections.length;

  const getAverageMood = (logs) => {
    if (logs.length === 0) return null;
    const total = logs.reduce((sum, log) => sum + (log.mood_value || 0), 0);
    return (total / logs.length).toFixed(1);
  };

  const averageMood = getAverageMood(moodLogs);

  const thirtyDayAvg = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = moodLogs.filter(
      (log) => new Date(log.created_at) >= thirtyDaysAgo,
    );
    return getAverageMood(recentLogs);
  };

  const recentAverage = thirtyDayAvg();

  const getTagFrequency = () => {
    const tagCounts = {};
    reflections.forEach((reflection) => {
      (reflection.tags || []).forEach((tag) => {
        tagCounts[tag.title] = (tagCounts[tag.title] || 0) + 1;
      });
    });
    return tagCounts;
  };

  const tagFrequency = getTagFrequency();
  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <section className="page">
        <p className="loading-state">Loading insights...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Insights</div>
          <h1>Your patterns</h1>
          <p className="page-lead">
            A simple look at how your week and month have gone.
          </p>
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>{totalReflections}</h2>
          <p>Total reflections written</p>
        </article>

        <article className="feature-card">
          <h2>{averageMood ?? "—"}</h2>
          <p>Average mood (all time)</p>
        </article>

        <article className="feature-card">
          <h2>{recentAverage ?? "—"}</h2>
          <p>Average mood (last 30 days)</p>
        </article>
      </div>

      <div className="panel">
        <h2>Most-used tags</h2>
        {topTags.length === 0 ? (
          <p className="muted-copy">
            Tag a few reflections to see your top themes here.
          </p>
        ) : (
          <ul className="tag-row">
            {topTags.map(([title, count]) => (
              <li key={title} className="tag-chip">
                #{title} <span className="muted-copy">({count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
