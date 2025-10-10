export const dynamic = "force-dynamic"; // pastikan tidak dibuild statis

import { cookies } from "next/headers";
import ActivityPage from "./ActivityPage";


export const metadata = {
  title: "DPBR - Activities",
  description: "List of your activities.",
};



export default async function ActivitiesPage() {
  const cookieStore = await cookies();
  const stravaSession = cookieStore.get("strava_session")?.value;
  const sessionData = stravaSession ? JSON.parse(stravaSession) : null;
  const stravaId = sessionData?.id;

  console.log("Strava ID:", stravaId);
    

  // Jika tidak ada sesi, redirect ke halaman utama

  return <ActivityPage stravaSession={stravaId} />;
}
