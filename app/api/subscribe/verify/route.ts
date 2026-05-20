import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const email = request.cookies.get("nextarch_user")?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
  } = body;

  // ── Verify Razorpay subscription signature ───────────────────
  // Signature = HMAC-SHA256(payment_id + "|" + subscription_id)
  const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Payment verification failed. Signature mismatch." },
      { status: 400 }
    );
  }

  // ── Set plan expiry (30 or 90 days from now as initial window)
  // Webhooks should extend this on renewal — for now a safe buffer
  const daysToAdd = plan === "monthly" ? 30 : 90;
  const planExpiresAt = new Date();
  planExpiresAt.setDate(planExpiresAt.getDate() + daysToAdd);

  // ── Tag user in MongoDB ──────────────────────────────────────
  const client = await clientPromise;
  await client
    .db("nextarch")
    .collection("users")
    .updateOne(
      { email },
      {
        $set: {
          plan,
          planExpiresAt,
          razorpaySubId: razorpay_subscription_id,
          razorpayPaymentId: razorpay_payment_id,
          subscribedAt: new Date(),
        },
      }
    );

  return NextResponse.json({ success: true, plan, planExpiresAt });
}
