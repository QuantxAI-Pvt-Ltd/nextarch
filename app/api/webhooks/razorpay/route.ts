import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

// How many days to extend planExpiresAt on each renewal
const PLAN_DAYS: Record<string, number> = {
  plan_Sey3obBDEfekzi: 30, // monthly
  plan_Sey48FsvwOMRgX: 90, // quarterly
};

// Map plan IDs to plan names
const PLAN_NAMES: Record<string, string> = {
  plan_Sey3obBDEfekzi: "monthly",
  plan_Sey48FsvwOMRgX: "quarterly",
};

export async function POST(request: NextRequest) {
  // ── 1. Read raw body (needed for signature verification) ─────
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  // ── 2. Verify Razorpay webhook signature ─────────────────────
  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSig !== signature) {
    console.error("[Webhook] Signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── 3. Parse event ───────────────────────────────────────────
  const event = JSON.parse(rawBody) as {
    event: string;
    payload: {
      subscription?: {
        entity: {
          id: string;
          plan_id: string;
          status: string;
        };
      };
      payment?: {
        entity: {
          id: string;
        };
      };
    };
  };

  const db = (await clientPromise).db("nextarch");
  const users = db.collection("users");

  // ── 4. Handle events ─────────────────────────────────────────
  switch (event.event) {

    // Renewal payment succeeded → extend planExpiresAt
    case "subscription.charged": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      const { id: subId, plan_id } = sub;
      const daysToAdd = PLAN_DAYS[plan_id] ?? 30;
      const planName = PLAN_NAMES[plan_id] ?? "monthly";

      // Find user by their stored subscription ID
      const user = await users.findOne({ razorpaySubId: subId });
      if (!user) {
        console.warn(`[Webhook] No user found for subscription ${subId}`);
        break;
      }

      // Extend from NOW (handles gaps if paywall was showing)
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + daysToAdd);

      await users.updateOne(
        { razorpaySubId: subId },
        {
          $set: {
            planExpiresAt: newExpiry,
            plan: planName,
            lastRenewedAt: new Date(),
            razorpayPaymentId: event.payload.payment?.entity.id,
          },
        }
      );

      console.log(`[Webhook] Renewed ${user.email} → ${planName} until ${newExpiry.toISOString()}`);
      break;
    }

    // Subscription cancelled or payment failed → revoke access
    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.halted": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      await users.updateOne(
        { razorpaySubId: sub.id },
        {
          $set: {
            plan: null,
            planExpiresAt: new Date(), // expire immediately
          },
        }
      );

      console.log(`[Webhook] Access revoked for subscription ${sub.id} (${event.event})`);
      break;
    }

    default:
      // Log unhandled events but always return 200 so Razorpay doesn't retry
      console.log(`[Webhook] Unhandled event: ${event.event}`);
  }

  return NextResponse.json({ received: true });
}
