import { useEffect, useState } from "react";
import api from "../api/axios";
import { parseApiDate } from "../utils/date";

export default function WeeklySummary() {
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
        console.error("Weekly summary fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getWeekStart = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  const weekStart = getWeekStart();
  const weeklyReflections = reflections.filter(
    (reflection) => parseApiDate(reflection.created_at) >= weekStart,
  );
  const weeklyMoodLogs = moodLogs.filter(
    (log) => parseApiDate(log.created_at) >= weekStart,
  );

  const getAverageMood = (logs) => {
    if (logs.length === 0) return null;
    const total = logs.reduce((sum, log) => sum + (log.mood_value || 0), 0);
    return (total / logs.length).toFixed(1);
  };

  const averageMood = getAverageMood(weeklyMoodLogs);

  const getTagFrequency = () => {
    const tagCounts = {};
    weeklyReflections.forEach((reflection) => {
      (reflection.tags || []).forEach((tag) => {
        tagCounts[tag.title] = (tagCounts[tag.title] || 0) + 1;
      });
    });
    return tagCounts;
  };

  const topTags = Object.entries(getTagFrequency())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <section className="page">
        <p className="loading-state">Loading weekly summary...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Weekly Summary</div>
          <h1>This week at a glance</h1>
          <p className="page-lead">
            A quick snapshot of your reflections, mood, and themes from the last
            7 days.
          </p>
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>{weeklyReflections.length}</h2>
          <p>Reflections this week</p>
        </article>

        <article className="feature-card">
          <h2>{averageMood ?? "—"}</h2>
          <p>Average mood this week</p>
        </article>

        <article className="feature-card">
          <h2>{weeklyMoodLogs.length}</h2>
          <p>Mood logs this week</p>
        </article>
      </div>

      <div className="panel">
        <h2>Top tags this week</h2>
        {topTags.length === 0 ? (
          <p className="muted-copy">
            Add tags to reflections this week to see your themes here.
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
