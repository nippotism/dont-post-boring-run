import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface StravaDeauthProps {
  accessToken: string;
  onDeauth: () => void;
}

export function StravaDeauth({ accessToken, onDeauth }: StravaDeauthProps) {
  const [loading, setLoading] = useState(false);

  const handleDeauth = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await fetch("https://www.strava.com/oauth/deauthorize", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ access_token: accessToken }),
      });

      localStorage.removeItem("strava_token");
      onDeauth(); // reset state in parent
    } catch (err) {
      console.error("Failed to deauthorize:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
          Disconnect Strava
        </CardTitle>
        <CardDescription className="text-red-600 dark:text-red-400">
          Revoke access to your Strava account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleDeauth}
          disabled={loading}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Disconnecting...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Strava
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
