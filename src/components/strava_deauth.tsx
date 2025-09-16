import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface StravaDeauthProps {
  accessToken: string;
  onDeauth: () => void;
}

export function StravaDeauth({ accessToken, onDeauth }: StravaDeauthProps) {
  const [loading, setLoading] = useState(false);
  const athleteId = accessToken;

  const handleDeauth = async () => {
    console.log("Deauthorizing Strava for athlete ID:", athleteId);
    if (!athleteId) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/deauthorize/${encodeURIComponent(athleteId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.removeItem("strava_athlete_id");
      onDeauth(); // reset state in parent
      window.location.href = "/"; // redirect to home page
    } catch (err) {
      console.error("Failed to deauthorize:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
        <Button
          onClick={handleDeauth}
          disabled={loading}
          variant="ghost"
          className=" dark:text-red-500 text-red-600 hover:text-red-700 rounded-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            </>
          ) : (
            <>
              <LogOut className="w-6 h-6" />
            </>
          )}
        </Button>
  );
}
