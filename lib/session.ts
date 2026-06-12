import { cookies } from "next/headers";

/**
 * Returns the email stored in the `nextarch_user` HTTP-only cookie,
 * or null if the user is not authenticated.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("nextarch_user")?.value ?? null;
}

/**
 * Returns true if the user is authenticated but has not yet accepted
 * the current versions of the Terms of Conditions and/or Privacy Policy.
 * The `nextarch_pending_legal` cookie is set by the login action when
 * one or both documents require re-acceptance.
 */
export async function hasPendingLegal(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("nextarch_pending_legal")?.value === "1";
}
