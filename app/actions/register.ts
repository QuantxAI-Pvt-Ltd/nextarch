"use server"
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// ── Current legal document versions ─────────────────────────────────────────
const CURRENT_TERMS_VERSION   = "1.0";
const CURRENT_PRIVACY_VERSION = "1.0";

export async function registeraction(_prev: unknown, formdata: FormData) {
  const name     = (formdata.get("reg_name")    as string)?.trim();
  const email    = (formdata.get("reg_email")   as string)?.trim().toLowerCase();
  const password =  formdata.get("reg_pass")    as string;
  const confirm  =  formdata.get("reg_confirm") as string;

  // ── Legal acceptance ────────────────────────────────────────────────────
  const termsAccepted   = formdata.get("terms_accepted")   === "on";
  const privacyAccepted = formdata.get("privacy_accepted") === "on";

  // ── Validation ──────────────────────────────────────────────────────────
  if (!name || !email || !password || !confirm) {
    return { error: "All fields are required." };
  }

  if (!termsAccepted) {
    return { error: "You must accept the Terms of Conditions." };
  }

  if (!privacyAccepted) {
    return { error: "You must accept the Privacy Policy." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email address." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  // ── DB: check for existing user ──────────────────────────────
  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // ── Insert user with hashed password + legal acceptance metadata ─────────
  const now = new Date();
  const hashedPassword = await bcrypt.hash(password, 12);
  await users.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: now,
    // Terms of Conditions acceptance
    termsAccepted:   true,
    termsAcceptedAt: now,
    termsVersion:    CURRENT_TERMS_VERSION,
    // Privacy Policy acceptance
    privacyAccepted:   true,
    privacyAcceptedAt: now,
    privacyVersion:    CURRENT_PRIVACY_VERSION,
  });

  redirect("/login?registered=1");
}
