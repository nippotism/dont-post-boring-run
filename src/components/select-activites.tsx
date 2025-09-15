import {use, useEffect, useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityData } from "@/types/strava"; // adjust import path
import ThemeToggle from "./ui/dark-mode";
import { StravaDeauth } from "./strava_deauth";
import { PaceCounter, timeConverter } from "@/hooks/logic";
import { useStravaData } from "@/hooks/useStravaData";

interface StravaPostGeneratorProps {
  activities: ActivityData[];
}


// Mock activities with your ActivityData interface
const mockActivities: ActivityData[] = [
  {
    id: 1,
    name: "Morning Run",
    type: "Run",
    distance: 5200,
    moving_time: 1715,
    elapsed_time: 1800,
    total_elevation_gain: 50,
    start_date: "2025-09-10T06:30:00Z",
    average_speed: 3.1,
    pace: "5:30",
    map: { summary_polyline: "" },
  },
  {
    id: 2,
    name: "Evening Ride",
    type: "Ride",
    distance: 22000,
    moving_time: 3912,
    elapsed_time: 4000,
    total_elevation_gain: 120,
    start_date: "2025-09-09T16:45:00Z",
    average_speed: 5.6,
    map: { summary_polyline: "" },
  },
  {
    id: 3,
    name: "Trail Hike",
    type: "Hike",
    distance: 7800,
    moving_time: 8049,
    elapsed_time: 8300,
    total_elevation_gain: 400,
    start_date: "2025-09-08T09:10:00Z",
    pace: "17:10",
    map: { summary_polyline: "" },
  },
  {
    id: 4,
    name: "Swim Training",
    type: "Swim",
    distance: 1500,
    moving_time: 2538,
    elapsed_time: 2600,
    total_elevation_gain: 0,
    start_date: "2025-09-07T14:00:00Z",
    map: { summary_polyline: "" },
  },
];

export function ActivityPage() {

    const AthleteId = localStorage.getItem("strava_athlete_id");

  // redirect early if no athlete
  if (!AthleteId) {
    window.location.href = "/";
  }

    const { activities, loading, error } = useStravaData(AthleteId!);



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const activityShow = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );



  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/bg2.jpg')",
       backgroundPosition: "center 74%"
       }}
    >
      {/* Optional overlay to darken the background */}
      <div/>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm justify-between">
        <ThemeToggle />
        <a 
        className="text-xl sm:text-4xl font-bold tracking-wider text-black font-calsans dark:text-white hover:underline hover:text-gray-800"
        href="http://localhost:5173"
        >dontpostboringrun.com</a>
        <StravaDeauth accessToken={String(AthleteId)} onDeauth={() => {}} />
      </nav>

      {/* Activities */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl mb-6 font-crimson">CHOOSE YOUR ACTIVITY</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-calsans">
        {loading
            ? // 🔹 Show skeleton cards while fetching
            Array.from({ length: 8 }).map((_, i) => (
                <Card
                key={i}
                className="flex flex-col rounded-none border border-transparent"
                >
                <CardHeader>
                    <CardTitle className="font-crimson text-3xl font-light">
                    <Skeleton className="h-8 w-3/4" />
                    </CardTitle>
                    <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4 font-crimson font-medium">
                    <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                        <div
                        key={j}
                        className="flex items-center flex-col mb-1 space-y-2"
                        >
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            ))
            : // 🔹 Show real activities when loaded
            activityShow.map((activity) => (
                <Card
                key={activity.id}
                className="flex flex-col rounded-none hover:bg-black/70 hover:text-white transition-colors duration-300 hover:border-white border border-transparent"
                >
                <CardHeader>
                    <CardTitle className="font-crimson text-3xl font-light">
                    {activity.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                    {new Date(activity.start_date).toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent className="space-y-2 font-crimson font-medium">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center flex-col mb-1">
                        <span>DISTANCE</span>
                        <span className="font-calsans text-sm">
                        {(activity.distance / 1000).toFixed(2)} km
                        </span>
                    </div>
                    <div className="flex items-center flex-col mb-1">
                        <span>TIME</span>
                        <span className="font-calsans text-sm">
                        {timeConverter(activity.moving_time)}
                        </span>
                    </div>
                    <div className="flex items-center flex-col mb-1">
                        <span>PACE</span>
                        <span className="font-calsans text-sm">
                        {PaceCounter(activity.moving_time, activity.distance)}
                        </span>
                    </div>
                    <div className="flex items-center flex-col mb-1">
                        <span>AVG SPEED</span>
                        <span className="font-calsans text-sm">
                        {activity.average_speed
                            ? (activity.average_speed * 3.6).toFixed(1)
                            : "N/A"}{" "}
                        km/h
                        </span>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
        </div>
               <Pagination className="mt-4 -mb-6">
                    <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : "font-crimson text-lg"
                        }
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                            currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "font-crimson text-lg"
                        }
                        />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
      </div>
    </div>
  );
};


