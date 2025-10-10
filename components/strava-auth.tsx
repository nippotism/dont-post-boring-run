"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import { FlipWords } from "./ui/flip-words";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";



interface StravaAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function StravaAuth({ onAuthSuccess}: StravaAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const words = ["run","cycle","ride","hike","walk","swim","trail"];

  const handleConnect = () => {
    setIsConnecting(true);
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/strava`);
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
  );
}