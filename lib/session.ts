import { cookies } from "next/headers";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  "nextarch-secure-session-fallback-secret-2026";

const encoder = new TextEncoder();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates an HMAC-SHA256 signature for the given email to prevent cookie tampering.
 * Fully compatible with Edge Runtime and Node.js via Web Crypto API.
 */
export async function signSessionToken(email: string): Promise<string> {
  const key = await getHmacKey(SESSION_SECRET);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(email)
  );
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${email}.${signatureHex}`;
}

/**
 * Verifies that the signed token has not been altered using constant-time comparison.
 * Returns the verified email address or null if invalid.
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<string | null> {
  if (!token || typeof token !== "string") return null;

  const lastDotIndex = token.lastIndexOf(".");
  if (lastDotIndex === -1) return null;

  const email = token.substring(0, lastDotIndex);
  const signatureHex = token.substring(lastDotIndex + 1);

  if (!email || !signatureHex) return null;

  try {
    const key = await getHmacKey(SESSION_SECRET);
    const expectedSig = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(email)
    );
    const expectedHex = Array.from(new Uint8Array(expectedSig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signatureHex.length !== expectedHex.length) {
      return null;
    }

    let match = 0;
    for (let i = 0; i < signatureHex.length; i++) {
      match |= signatureHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }

    return match === 0 ? email : null;
  } catch {
    return null;
  }
}

/**
 * Returns the verified email stored in the `nextarch_user` HTTP-only cookie,
 * or null if the user is not authenticated or the cookie was tampered with.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("nextarch_user")?.value;
  return await verifySessionToken(token);
}

/**
 * Returns true if the user is authenticated but has not yet accepted
 * the current versions of the Terms of Conditions and/or Privacy Policy.
 */
export async function hasPendingLegal(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("nextarch_pending_legal")?.value === "1";
}
