import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUserEmail } from "@/lib/session";

const PLANS = {
  monthly: { planId: "plan_TDQj68UGe8Fxj5", label: "Monthly Plan (₹250/mo)", totalCount: 12 },
  quarterly: { planId: "plan_TDQkJhulcfdsjn", label: "Quarterly Plan (₹500/3mo)", totalCount: 4 },
} as const;

type PlanKey = keyof typeof PLANS;

export async function POST(request: NextRequest) {
  try {
    const email = await getCurrentUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const plan = body.plan as PlanKey;
    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid subscription plan selected" }, { status: 400 });
    }

    // ── Guard: env vars must be set ─────────────────────────────
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment service configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { planId, label, totalCount } = PLANS[plan];

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
  } catch {
    return NextResponse.json(
      { error: "Failed to initialize subscription checkout. Please try again." },
      { status: 500 }
    );
  }
}
