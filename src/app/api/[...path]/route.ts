import { NextRequest, NextResponse } from "next/server";

// Proxy all /api/* calls to the real backend. Unlike next.config rewrites,
// a Route Handler lets us rewrite the backend's Set-Cookie headers so the
// cookies actually bind to localhost during development (the backend scopes
// them to .realtipro.com + Secure, which the browser drops on http://localhost).
const API_TARGET =
  process.env.NEXT_API_PROXY_TARGET || "https://stgadm.realtipro.com/api";

// Hop-by-hop / host-specific headers we must not forward verbatim.
const STRIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

const isLocalRequest = (req: NextRequest): boolean => {
  const host = req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol;
  return (
    proto.startsWith("http:") ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1")
  );
};

// Rewrite a Set-Cookie string so it sticks on http://localhost. Drops the
// Domain attribute (cookie becomes host-only -> localhost), drops Secure
// (localhost dev is http), and downgrades SameSite=None -> Lax.
// Only applied for local requests; on live the cookie is passed through
// unchanged so existing production behaviour is untouched.
const rewriteSetCookie = (cookie: string): string =>
  cookie
    // remove `; Domain=...` (and a leading `Domain=...;` edge case)
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/^\s*Domain=[^;]*;?\s*/i, "")
    .replace(/;\s*Secure/gi, "")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");

const proxy = async (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
): Promise<Response> => {
  const { path } = await ctx.params;
  const search = req.nextUrl.search; // includes leading "?"
  const targetUrl = `${API_TARGET}/${(path || []).join("/")}${search}`;

  // Forward request headers (minus host-specific ones).
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // GET, HEAD, and DELETE carry no request body.
  const hasBody = !["GET", "HEAD", "DELETE"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { detail: "Upstream request failed" },
      { status: 502 }
    );
  }

  // Copy response headers, rewriting cookies and dropping encoding headers
  // that no longer match the (already-decoded) body fetch returns.
  const resHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "set-cookie" || k === "content-encoding" || k === "content-length") {
      return;
    }
    resHeaders.set(key, value);
  });

  const local = isLocalRequest(req);
  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    resHeaders.append(
      "set-cookie",
      local ? rewriteSetCookie(cookie) : cookie
    );
  }

  const resBody = await backendRes.arrayBuffer();
  return new Response(resBody, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: resHeaders,
  });
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
export const HEAD = proxy;

// Always run dynamically — never cache a proxied API response.
export const dynamic = "force-dynamic";
