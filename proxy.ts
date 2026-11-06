import { NextRequest, NextResponse } from "next/server"
export function proxy(request: NextRequest) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const message = "Les écritures de ce module FEBADCO ne sont pas encore activées."
    return NextResponse.json({ error: message, message }, { status: 409 })
  }
  return NextResponse.next()
}
export const config = { matcher: "/api/:path*" }
