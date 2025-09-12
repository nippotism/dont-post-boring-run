import { useState, useEffect } from "react";
import type { ActivityData } from "@/types/strava";

export const useStravaData = (accessToken: string | null) => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        // For demo purposes, we'll use mock data
        // In production, this would call the Strava API
        const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError("Failed to fetch activities");
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [accessToken]);

  return { activities, selectedActivity, setSelectedActivity, loading, error };
};