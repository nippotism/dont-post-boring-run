import { useState } from "react";
import { StravaAuth } from "@/components/strava-auth";
import InstallPWA from "@/components/ui/pwa";
// import { StravaDeauth } from "@/components/strava_deauth";
// import { StravaPostGenerator } from "@/components/strava-post-generator";
// import { useStravaData } from "@/hooks/useStravaData";
// import { Activity } from "lucide-react";
// import { ActivityPage } from "@/components/select-activites";

const Index = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Removed unused handleImageGenerated function

  // const handleDeauth = () => {
  //   setAccessToken(null);
  //   localStorage.removeItem("strava_athlete_id");
  // };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-8">
        {!accessToken ? (
          <div className="max-w-md mx-auto">
            <InstallPWA />
            <StravaAuth onAuthSuccess={setAccessToken} isAuthenticated={false} />
          </div>
        ) : (
          <>
            {window.location.href = "/activities"}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
