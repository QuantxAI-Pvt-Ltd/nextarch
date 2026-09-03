import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUserEmail } from "@/lib/session";

export async function GET() {
  try {
    const email = await getCurrentUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("nextarch");
    const user = await db.collection("users").findOne({ email: String(email) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();

    // ── Trial window: 7 days from account creation ───────────────
    const createdAt = user.createdAt ? new Date(user.createdAt as string | number | Date) : new Date();
    const trialEnd = new Date(createdAt);
    trialEnd.setDate(trialEnd.getDate() + 7);
    const trialDaysLeft = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
    const trialActive = now < trialEnd;

    // ── Paid subscription check ──────────────────────────────────
    const planActive =
      !!user.planExpiresAt && now < new Date(user.planExpiresAt as string | number | Date);

    return NextResponse.json({
      email: typeof user.email === "string" ? user.email : "",
      name: typeof user.name === "string" ? user.name : "",
      trialActive,
      trialDaysLeft,
      plan: typeof user.plan === "string" ? user.plan : null,
      planExpiresAt: user.planExpiresAt ?? null,
      planActive,
      hasAccess: trialActive || planActive,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch usage status" }, { status: 500 });
  }
}
