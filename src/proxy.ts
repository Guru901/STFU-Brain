import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const codes = request.cookies.get("codes")?.value;

  const path = request.nextUrl.pathname;

  const isAuthed = Boolean(user && codes);

  if (!isAuthed) {
    if (path !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  if (isAuthed) {
    if (path === "/" || path === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
