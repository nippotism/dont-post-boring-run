import { useEffect, useState } from "react";
import { StravaAuth } from "@/components/strava-auth";
import { Footer2 } from "@/components/ui/footer";
// import { StravaDeauth } from "@/components/strava_deauth";
// import { StravaPostGenerator } from "@/components/strava-post-generator";
// import { useStravaData } from "@/hooks/useStravaData";
// import { Activity } from "lucide-react";
// import { ActivityPage } from "@/components/select-activites";

const Index = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);


  useEffect(() => {
    const storedAthleteId = localStorage.getItem("strava_athlete_id");
    if (storedAthleteId) {
      window.location.href = "/activities";
      return; // no need to parse URL
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto flex-grow space-y-8">
        {!accessToken && (
          <div className="max-w-md mx-auto">
            <StravaAuth/>
          </div>
        )}
      </div>
      <footer className="relative text-white py-6 text-center backdrop-blur-md bg-gradient-to-b from-transparent via-black/60 to-black/90">
        <Footer2 />
      </footer>
    </div>
  );
};

export default Index;
