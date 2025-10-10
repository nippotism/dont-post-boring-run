"use client";

import { StravaAuth } from "@/components/strava-auth";
import { Footer2 } from "@/components/ui/footer"

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto flex-grow space-y-8">
        <div className="max-w-md mx-auto">
          <StravaAuth/>
        </div>
      </div>
      <footer className="relative text-white py-6 text-center backdrop-blur-md bg-gradient-to-b from-transparent via-black/60 to-black/90">
        <Footer2 />
      </footer>
    </div>
  );
}
