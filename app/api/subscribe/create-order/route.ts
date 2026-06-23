import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const PLANS = {
  monthly:   { planId: "plan_SvGnbshdhr88rI", label: "Monthly Plan (₹250/mo)",    totalCount: 12 },
  quarterly: { planId: "plan_SvGmu2taomen9S", label: "Quarterly Plan (₹500/3mo)", totalCount: 4  },
} as const;

type PlanKey = keyof typeof PLANS;

export async function POST(request: NextRequest) {
  const email = request.cookies.get("nextarch_user")?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as PlanKey;

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // ── Guard: env vars must be set in Vercel dashboard ──────────
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("[create-order] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars");
    return NextResponse.json(
      { error: "Payment service not configured. Contact support." },
      { status: 503 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { planId, label, totalCount } = PLANS[plan];

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
      notes: { plan, email },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      label,
    });
  } catch (err: unknown) {
    // Surface the actual Razorpay error (e.g. invalid plan ID, key mismatch)
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "description" in err
          ? String((err as Record<string, unknown>).description)
          : JSON.stringify(err);
    console.error("[create-order]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
