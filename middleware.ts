import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const cookie = request.cookies.get("strava_session");

  console.log("🛰️ Middleware triggered for:", url.pathname);
  console.log("🍪 strava_session cookie:", cookie?.value);
  return NextResponse.next();
}

