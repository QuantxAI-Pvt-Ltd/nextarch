import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const PLANS = {
  monthly:   { planId: "plan_Sey3obBDEfekzi", label: "Monthly Plan (₹500/mo)", totalCount: 12 },
  quarterly: { planId: "plan_Sey48FsvwOMRgX", label: "Quarterly Plan (₹1,000/3mo)", totalCount: 4 },
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

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
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
}
