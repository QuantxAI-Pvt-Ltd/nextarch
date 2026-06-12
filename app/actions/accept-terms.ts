"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

// ── Version constants — bump these to force re-acceptance on next login ──
const CURRENT_TERMS_VERSION   = "1.0";
const CURRENT_PRIVACY_VERSION = "1.0";

export async function acceptTermsAction(_prev: unknown, formdata: FormData) {
  const cookieStore = await cookies();

  // ── Guard: must be authenticated ────────────────────────────────────────
  const email = cookieStore.get("nextarch_user")?.value;
  if (!email) {
    redirect("/login");
  }

  // ── Guard: pending legal cookie must exist ───────────────────────────────
  const hasPending = cookieStore.get("nextarch_pending_legal")?.value === "1";
  if (!hasPending) {
    redirect("/calculator");
  }

  // ── Read which checkboxes were submitted ─────────────────────────────────
  const termsSubmitted   = formdata.get("terms_accepted") === "on";
  const privacySubmitted = formdata.get("privacy_accepted") === "on";

  if (!termsSubmitted && !privacySubmitted) {
    return { error: "You must accept both documents to continue." };
  }
  if (!termsSubmitted) {
    return { error: "You must accept the Terms of Conditions." };
  }
  if (!privacySubmitted) {
    return { error: "You must accept the Privacy Policy." };
  }

  // ── Update MongoDB ────────────────────────────────────────────────────────
  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const now = new Date();
  const updateFields: Record<string, unknown> = {};

  if (termsSubmitted) {
    updateFields.termsAccepted    = true;
    updateFields.termsAcceptedAt  = now;
    updateFields.termsVersion     = CURRENT_TERMS_VERSION;
  }
  if (privacySubmitted) {
    updateFields.privacyAccepted    = true;
    updateFields.privacyAcceptedAt  = now;
    updateFields.privacyVersion     = CURRENT_PRIVACY_VERSION;
  }

  await users.updateOne({ email }, { $set: updateFields });

  // ── Clear pending cookie ──────────────────────────────────────────────────
  cookieStore.delete("nextarch_pending_legal");

  redirect("/calculator");
}
