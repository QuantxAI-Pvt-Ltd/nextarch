import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const email = request.cookies.get("nextarch_user")?.value;

  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("nextarch");
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();

  // ── Trial window: 7 days from account creation ───────────────
  const trialEnd = new Date(user.createdAt as Date);
  trialEnd.setDate(trialEnd.getDate() + 7);
  const trialDaysLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
  const trialActive = now < trialEnd;

  // ── Paid subscription check ──────────────────────────────────
  const planActive =
    !!user.planExpiresAt && now < new Date(user.planExpiresAt as Date);

  return NextResponse.json({
    email: user.email,
    name: user.name,
    trialActive,
    trialDaysLeft,
    plan: user.plan ?? null,
    planExpiresAt: user.planExpiresAt ?? null,
    planActive,
    hasAccess: trialActive || planActive,
  });
}
