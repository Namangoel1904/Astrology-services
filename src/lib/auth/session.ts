import crypto from "crypto";
import { cookies } from "next/headers";

export type UserRole = "admin" | "astrologer";

export interface SessionPayload {
  username: string;
  name: string;
  role: UserRole;
  astrologerId?: string;
  exp: number;
}

const SESSION_COOKIE = "jyotish_session";
const SESSION_SECRET = process.env.BOOKING_SESSION_SECRET || "jyotish-secret";
const MAX_AGE = 60 * 60 * 24; // 24h

function sign(data: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

function encode(payload: Omit<SessionPayload, "exp">) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const body = JSON.stringify({ ...payload, exp });
  const base = Buffer.from(body).toString("base64url");
  const signature = sign(base);
  return `${base}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [base, signature] = token.split(".");
  if (!base || !signature) return null;
  if (sign(base) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(base, "base64url").toString()) as SessionPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export function createSession(payload: Omit<SessionPayload, "exp">) {
  const value = encode(payload);
  cookies().set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

