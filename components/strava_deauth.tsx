"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function StravaDeauth() {
  const [loading, setLoading] = useState(false);
  const [athleteId, setAthleteId] = useState<string | null>(null);

  // Ambil athleteId dari cookies lewat API
  useEffect(() => {
    const fetchAthleteId = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setAthleteId(data.athleteId);
    };
    fetchAthleteId();
  }, []);

  const handleDeauth = async () => {
    if (!athleteId) return;
    setLoading(true);
    try {
      // Panggil backend API untuk deauth
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/deauthorize/${encodeURIComponent(athleteId)}`,
        { method: "POST", credentials: "include" }
      );

      // Hapus cookies di Next
      await fetch("/api/logout", { method: "POST", credentials: "include" });

      window.location.href = "/";
    } catch (err) {
      console.error("Failed to deauthorize:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDeauth}
      disabled={loading || !athleteId}
      variant="ghost"
      className="dark:text-red-500 text-red-600 hover:text-red-700 rounded-none"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-6 h-6" />}
    </Button>
  );
}
