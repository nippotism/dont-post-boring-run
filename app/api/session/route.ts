import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const stravaSession = cookieStore.get("strava_session")?.value;

  if (!stravaSession) {
    return NextResponse.json({ athleteId: null });
  }

  try {
    const data = JSON.parse(stravaSession);
    return NextResponse.json({ athleteId: data.id || null });
  } catch {
    return NextResponse.json({ athleteId: null });
  }
}
