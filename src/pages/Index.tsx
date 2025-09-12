import { useState, useEffect } from "react";
import { StravaAuth } from "@/components/strava-auth";
import { StravaDeauth } from "@/components/strava_deauth";
import { StravaPostGenerator } from "@/components/strava-post-generator";
import { useStravaData } from "@/hooks/useStravaData";

const Index = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // restore token from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem("strava_token");
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const { activities } = useStravaData(accessToken);

  // Removed unused handleImageGenerated function

  const handleDeauth = () => {
    setAccessToken(null);
    localStorage.removeItem("strava_token");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {!accessToken ? (
          <div className="max-w-md mx-auto">
            <StravaAuth onAuthSuccess={setAccessToken} isAuthenticated={false} />
          </div>
        ) : (
          <>

            <StravaPostGenerator
              activities={activities}
            />
            <StravaDeauth accessToken={accessToken} onDeauth={handleDeauth} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
