import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface StravaAuthProps {
  onAuthSuccess: (accessToken: string) => void;
  isAuthenticated: boolean;
}

export function StravaAuth({ onAuthSuccess, isAuthenticated }: StravaAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const STRAVA_CLIENT_ID = "171891";
  const STRAVA_CLIENT_SECRET = "e22ab6a6718c8f356f2ca45b6c6f83936e488371"; // ⚠️ aman kalau di backend, jangan hardcode production
  const REDIRECT_URI = "https://dont-post-boring-run.vercel.app/"; // atau halaman callback kamu
  const SCOPE = "activity:read_all";

    useEffect(() => {
    const savedToken = localStorage.getItem("strava_token");
    if (savedToken) {
      onAuthSuccess(savedToken);
    } else {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        exchangeToken(code);
      }
    }
  }, []);


  // Step 2: tukar code dengan access_token
  const exchangeToken = async (code: string) => {
    setIsConnecting(true);
    setError(null);
    try {
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: STRAVA_CLIENT_ID,
          client_secret: STRAVA_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        }),
      });

      if (!response.ok) throw new Error(`Strava OAuth failed: ${response.status}`);

      const data = await response.json();
      const token = data.access_token;
      onAuthSuccess(token);

      // opsional: simpan token agar tidak hilang saat reload
      localStorage.setItem("strava_token", token);

      // bersihkan query param dari URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to Strava. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Step 3: tombol redirect ke Strava
  const handleConnect = () => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPE}&approval_prompt=force`;
    window.location.href = authUrl;
  };

  if (isAuthenticated) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5" />
            Connected to Strava
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Successfully connected! Your recent activities are now available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ✓ Authenticated
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-strava-orange rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.172"/>
          </svg>
        </div>
        <CardTitle>Connect Your Strava Account</CardTitle>
        <CardDescription>
          Connect to Strava to access your activities and create custom post images
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium">What you'll get:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Access to your recent activities</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Activity stats and route data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Custom post image generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Multiple design templates</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          size="lg"
          variant="default"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect with Strava
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will redirect you to Strava to authorize access to your activity data.
          We only request read access to your public activity information.
        </p>
      </CardContent>
    </Card>
  );
}