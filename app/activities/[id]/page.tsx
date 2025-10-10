// app/activities/[id]/page.tsx
import { cookies } from "next/headers";
import ActivityTemplatePage from "./TemplatePage";
import { Metadata } from "next";

export const dynamic = "force-dynamic"; // agar tidak dibuild statis

export const metadata: Metadata = {
  title: "DPBR - Template",
  description: "Choose your template for activity details.",
};

export default async function ActivityTemplateRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  const cookieStore = await cookies();
  const stravaSession = cookieStore.get("strava_session")?.value;

  let athleteId: string | null = null;
  if (stravaSession) {
    try {
      const sessionData = JSON.parse(stravaSession);
      athleteId = sessionData.id;
    } catch {
      athleteId = stravaSession; 
    }
  }

  return <ActivityTemplatePage id={id} athleteId={athleteId} />;
}
