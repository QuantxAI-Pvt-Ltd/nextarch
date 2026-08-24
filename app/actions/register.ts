"use server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// ── Current legal document versions ─────────────────────────────────────────
const CURRENT_TERMS_VERSION = "1.0";
const CURRENT_PRIVACY_VERSION = "1.0";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registeraction(_prev: unknown, formdata: FormData) {
  const rawName = formdata.get("reg_name");
  const rawEmail = formdata.get("reg_email");
  const rawPassword = formdata.get("reg_pass");
  const rawConfirm = formdata.get("reg_confirm");

  if (
    typeof rawName !== "string" ||
    typeof rawEmail !== "string" ||
    typeof rawPassword !== "string" ||
    typeof rawConfirm !== "string"
  ) {
    return { error: "All fields are required." };
  }

  // Strip dangerous control chars and sanitize name
  const name = rawName.trim().replace(/[<>]/g, "");
  const email = rawEmail.trim().toLowerCase();
  const password = rawPassword;
  const confirm = rawConfirm;

  // ── Legal acceptance ────────────────────────────────────────────────────
  const termsAccepted = formdata.get("terms_accepted") === "on";
  const privacyAccepted = formdata.get("privacy_accepted") === "on";

  // ── Validation ──────────────────────────────────────────────────────────
  if (!name || !email || !password || !confirm) {
    return { error: "All fields are required." };
  }

  if (name.length < 2 || name.length > 100) {
    return { error: "Name must be between 2 and 100 characters." };
  }

  if (!termsAccepted) {
    return { error: "You must accept the Terms of Conditions." };
  }

  if (!privacyAccepted) {
    return { error: "You must accept the Privacy Policy." };
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return { error: "Invalid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password.length > 128) {
    return { error: "Password cannot exceed 128 characters." };
  }

  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  // ── DB: check for existing user (strictly parameterized) ───────────────────
  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const existing = await users.findOne({ email: String(email) });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // ── Insert user with hashed password + legal acceptance metadata ─────────
  const now = new Date();
  const hashedPassword = await bcrypt.hash(password, 12);
  await users.insertOne({
    name: String(name),
    email: String(email),
    password: hashedPassword,
    createdAt: now,
    // Terms of Conditions acceptance
    termsAccepted: true,
    termsAcceptedAt: now,
    termsVersion: CURRENT_TERMS_VERSION,
    // Privacy Policy acceptance
    privacyAccepted: true,
    privacyAcceptedAt: now,
    privacyVersion: CURRENT_PRIVACY_VERSION,
  });

  redirect("/login?registered=1");
}
