"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signSessionToken } from "@/lib/session";

// ── Bump these versions to force re-acceptance on next login ───────────────
const CURRENT_TERMS_VERSION = "1.0";
const CURRENT_PRIVACY_VERSION = "1.0";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginaction(_prev: unknown, formdata: FormData) {
  const rawEmail = formdata.get("login_email");
  const rawPassword = formdata.get("login_pass");

  if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
    return { error: "Email and password are required." };
  }

  const email = rawEmail.trim().toLowerCase();
  const password = rawPassword;

  if (!email || !password || !EMAIL_REGEX.test(email) || email.length > 254) {
    return { error: "Invalid operator ID or password." };
  }

  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  // Prevent NoSQL query injection by strictly using string literal
  const user = await users.findOne({ email: String(email) });
  if (!user || typeof user.password !== "string") {
    return { error: "Invalid operator ID or password." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Invalid operator ID or password." };
  }

  // ── Set signed auth cookie ─────────────────────────────────────────────
  const signedToken = await signSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set("nextarch_user", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });

  // ── Legal acceptance check ───────────────────────────────────────────
  const needsTermsAcceptance =
    !user.termsAccepted || user.termsVersion !== CURRENT_TERMS_VERSION;

  const needsPrivacyAcceptance =
    !user.privacyAccepted || user.privacyVersion !== CURRENT_PRIVACY_VERSION;

  if (needsTermsAcceptance || needsPrivacyAcceptance) {
    // Set a short-lived cookie to flag pending legal acceptance (15 min)
    cookieStore.set("nextarch_pending_legal", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15,
      path: "/",
      sameSite: "lax",
    });
    redirect("/accept-terms");
  }

  redirect("/calculator");
}

export async function to_desc() {
  redirect("/description");
}

export async function to_calc() {
  redirect("/calculator");
}