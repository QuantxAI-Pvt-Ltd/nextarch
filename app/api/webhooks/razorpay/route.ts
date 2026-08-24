import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

// How many days to extend planExpiresAt on each renewal
const PLAN_DAYS: Record<string, number> = {
  plan_TDQj68UGe8Fxj5: 30, // monthly
  plan_TDQkJhulcfdsjn: 90, // quarterly
};

// Map plan IDs to plan names
const PLAN_NAMES: Record<string, string> = {
  plan_TDQj68UGe8Fxj5: "monthly",
  plan_TDQkJhulcfdsjn: "quarterly",
};

export async function POST(request: NextRequest) {
  try {
    // ── 1. Read raw body (needed for signature verification) ─────
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 400 });
    }

    // ── 2. Verify Razorpay webhook signature (Constant-Time) ──────
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ── 3. Parse event safely ───────────────────────────────────
    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        subscription?: {
          entity?: {
            id?: string;
            plan_id?: string;
            status?: string;
          };
        };
        payment?: {
          entity?: {
            id?: string;
          };
        };
      };
    };

    if (!event.event) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    const db = (await clientPromise).db("nextarch");
    const users = db.collection("users");

    // ── 4. Handle events ─────────────────────────────────────────
    switch (event.event) {
      // Renewal payment succeeded → extend planExpiresAt
      case "subscription.charged": {
        const sub = event.payload?.subscription?.entity;
        if (!sub?.id || !sub?.plan_id) break;

        const subId = String(sub.id);
        const planId = String(sub.plan_id);
        const daysToAdd = PLAN_DAYS[planId] ?? 30;
        const planName = PLAN_NAMES[planId] ?? "monthly";

        const user = await users.findOne({ razorpaySubId: subId });
        if (!user) break;

        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + daysToAdd);

        await users.updateOne(
          { razorpaySubId: subId },
          {
            $set: {
              planExpiresAt: newExpiry,
              plan: planName,
              lastRenewedAt: new Date(),
              razorpayPaymentId: event.payload?.payment?.entity?.id
                ? String(event.payload.payment.entity.id)
                : undefined,
            },
          }
        );
        break;
      }

      // Subscription cancelled or payment failed → revoke access
      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.halted": {
        const sub = event.payload?.subscription?.entity;
        if (!sub?.id) break;

        await users.updateOne(
          { razorpaySubId: String(sub.id) },
          {
            $set: {
              plan: null,
              planExpiresAt: new Date(), // expire immediately
            },
          }
        );
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Internal webhook processing error" }, { status: 500 });
  }
}
