import {useState} from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PaceCounter, timeConverter } from "@/hooks/logic";
import { useStravaData } from "@/hooks/useStravaData";
import { Navbar } from "./ui/navbar";






export function ActivityPage() {

    const AthleteId = localStorage.getItem("strava_athlete_id");

  // redirect early if no athlete
  if (!AthleteId) {
    window.location.href = "/";
  }

    const { activities, loading} = useStravaData(AthleteId!);



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
      <Navbar />
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
              <Link key={activity.id} to={`/activities/${activity.id}`}>
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
              </Link>
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


