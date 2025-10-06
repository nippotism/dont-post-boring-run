import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FlipWords } from "./ui/flip-words";
import { Loader2 } from "lucide-react";



interface StravaAuthProps {
  onAuthSuccess: (accessToken: string) => void;
  isAuthenticated: boolean;
}

export function StravaAuth({ onAuthSuccess, isAuthenticated }: StravaAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const words = ["run","cycle","ride","hike","walk","swim","trail"];


    useEffect(() => {
    const storedAthleteId = localStorage.getItem("strava_athlete_id");
    if (storedAthleteId) {
      onAuthSuccess(storedAthleteId);
      return; // no need to parse URL
    }

    const params = new URLSearchParams(window.location.search);
    const athleteId = params.get("athlete");
    if (athleteId) {
      onAuthSuccess(athleteId);
      localStorage.setItem("strava_athlete_id", athleteId);

      // Clean URL to remove query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  // Step 2: tukar code dengan access_token

  // Step 3: tombol redirect ke Strava
  const handleConnect = () => {
    setIsConnecting(true);
    // setError(null);
    // Redirect to backend OAuth route
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/strava`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
  {/* Background */}
  <div className="fixed inset-0 -z-10">
    <img
      src="/images/bg1.jpg"
      alt="Background"
      className="w-full h-full object-cover object-[63%]"
    />
     <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black" />
  </div>
  <h1 className="font-bold text-white font-calsans tracking-wider leading-tight">
    <div className="flex justify-center">
      <div className="text-left">
        <span className="block text-8xl sm:text-8xl sm:whitespace-nowrap whitespace-normal sm:space-y-0 space-y-2 sm:mt-0 mt-8">
          <span className="block">dont</span>
          <span className="block">post</span>
          <span className="block">boring</span>
          <span className="block sm:inline">
            <FlipWords words={words} />
          </span>
          <span className="block">.com</span>
        </span>
      </div>
    </div>
  </h1>

  <Button
    onClick={handleConnect}
    disabled={isConnecting}
    size="sm"
    variant="default"
    className="px-3 py-1 rounded-none mt-6 bg-[#fc5200] hover:bg-white hover:text-black text-white font-crimson font-light tracking-widest border border-transparent hover:border-black transition-colors duration-300"
  >
    {isConnecting ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        CONNECTING...
      </>
    ) : (
      <>CONNECT YOUR STRAVA</>
    )}
  </Button>

  <img src="/images/strava.png" alt="Strava Logo" className="h-2.5 w-auto mt-3" />
</div>


    // <Card>
    //   <CardHeader className="text-center">
    //     <div className="w-16 h-16 mx-auto mb-4 bg-strava-orange rounded-full flex items-center justify-center">
    //       <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
    //         <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.172"/>
    //       </svg>
    //     </div>
    //     <CardTitle>Connect Your Strava Account</CardTitle>
    //     <CardDescription>
    //       Connect to Strava to access your activities and create custom post images
    //     </CardDescription>
    //   </CardHeader>
      
    //   <CardContent className="space-y-4">
    //     {error && (
    //       <Alert variant="destructive">
    //         <AlertCircle className="h-4 w-4" />
    //         <AlertDescription>{error}</AlertDescription>
    //       </Alert>
    //     )}

    //     <div className="space-y-3">
    //       <h4 className="text-sm font-medium">What you'll get:</h4>
    //       <div className="space-y-2 text-sm text-muted-foreground">
    //         <div className="flex items-center gap-2">
    //           <CheckCircle className="w-4 h-4 text-green-500" />
    //           <span>Access to your recent activities</span>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <CheckCircle className="w-4 h-4 text-green-500" />
    //           <span>Activity stats and route data</span>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <CheckCircle className="w-4 h-4 text-green-500" />
    //           <span>Custom post image generation</span>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <CheckCircle className="w-4 h-4 text-green-500" />
    //           <span>Multiple design templates</span>
    //         </div>
    //       </div>
    //     </div>

    //     <Button 
    //       onClick={handleConnect} 
    //       disabled={isConnecting}
    //       size="lg"
    //       variant="default"
    //       className="w-full bg-amber-600 hover:bg-amber-700 text-white"
    //     >
    //       {isConnecting ? (
    //         <>
    //           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    //           Connecting...
    //         </>
    //       ) : (
    //         <>
    //           <ExternalLink className="w-4 h-4 mr-2" />
    //           Connect with Strava
    //         </>
    //       )}
    //     </Button>

    //     <p className="text-xs text-muted-foreground text-center">
    //       This will redirect you to Strava to authorize access to your activity data.
    //       We only request read access to your public activity information.
    //     </p>
    //   </CardContent>
    // </Card>
  );
}