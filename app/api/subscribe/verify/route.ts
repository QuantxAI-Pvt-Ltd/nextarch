import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { getCurrentUserEmail } from "@/lib/session";

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

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan,
    } = body;

    if (
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_subscription_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      (plan !== "monthly" && plan !== "quarterly")
    ) {
      return NextResponse.json({ error: "Invalid payment parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Payment verification unavailable" }, { status: 503 });
    }

    // ── Verify Razorpay subscription signature (Constant-Time) ──
    const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigBuffer = Buffer.from(razorpay_signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return NextResponse.json(
        { error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      );
    }

    // ── Set plan expiry (30 or 90 days from now as initial window)
    const daysToAdd = plan === "monthly" ? 30 : 90;
    const planExpiresAt = new Date();
    planExpiresAt.setDate(planExpiresAt.getDate() + daysToAdd);

    // ── Tag user in MongoDB (parameterized) ──────────────────────
    const client = await clientPromise;
    await client
      .db("nextarch")
      .collection("users")
      .updateOne(
        { email: String(email) },
        {
          $set: {
            plan: String(plan),
            planExpiresAt,
            razorpaySubId: String(razorpay_subscription_id),
            razorpayPaymentId: String(razorpay_payment_id),
            subscribedAt: new Date(),
          },
        }
      );

    return NextResponse.json({ success: true, plan, planExpiresAt });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify subscription. Please contact support." },
      { status: 500 }
    );
  }
}
