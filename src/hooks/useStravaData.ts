import { useState, useEffect } from "react";
import type { ActivityData } from "@/types/strava";

export const useStravaData = (athleteId: string | null) => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!athleteId) return;

    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activities?athlete=${encodeURIComponent(athleteId)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ActivityData[] = await response.json();
        setActivities(data);
      } catch (err) {
        setError("Failed to fetch activities from backend");
        console.error("Error fetching activities:", err);
        localStorage.removeItem("strava_athlete_id");
        // refresh the page to reset state
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [athleteId]);

  return { activities, selectedActivity, setSelectedActivity, loading, error };
};
