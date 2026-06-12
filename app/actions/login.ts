"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// ── Bump these versions to force re-acceptance on next login ───────────────
const CURRENT_TERMS_VERSION   = "1.0";
const CURRENT_PRIVACY_VERSION = "1.0";

export async function loginaction(_prev: unknown, formdata: FormData) {
  const email = (formdata.get("login_email") as string)?.trim().toLowerCase();
  const password = formdata.get("login_pass") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) {
    return { error: "Invalid operator ID or access key." };
  }

  const isValid = await bcrypt.compare(password, user.password as string);
  if (!isValid) {
    return { error: "Invalid operator ID or access key." };
  }

  // ── Set auth cookie ────────────────────────────────────────────────────
  const cookieStore = await cookies();
  cookieStore.set("nextarch_user", email, {
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