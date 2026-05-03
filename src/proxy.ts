// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!session?.user || session.user.role !== "admin") {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
