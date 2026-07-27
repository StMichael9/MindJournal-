import { useEffect, useState } from "react";
import api from "../api/axios";

const InsightsOverview = () => {
  const [reflections, setReflections] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, moodRes] = await Promise.all([
          api.get("/reflections"),
          api.get("/mood_logs"),
        ]);
        setReflections(refRes.data);
        setMoodLogs(moodRes.data);
      } catch (e) {
        console.error("Insights fetch error:", e);
      }
    };
    fetchData();
  }, []);

  return <div>InsightsOverview</div>;
};

export default InsightsOverview;
