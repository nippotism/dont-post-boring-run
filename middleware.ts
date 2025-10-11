import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const cookie = request.cookies.get("strava_session");

  console.log("🛰️ Middleware triggered for:", url.pathname);
  console.log("🍪 strava_session cookie:", cookie?.value);

  if (!cookie) {
    console.log("🚫 No session, redirecting to /");
    // Gunakan URL absolut (WAJIB)
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("✅ Cookie found, continue to page");
  return NextResponse.next();
}

export const config = {
  matcher: ["/activities/:path*"],
};
