import { cookies } from "next/headers";

/**
 * Returns the email stored in the `nextarch_user` HTTP-only cookie,
 * or null if the user is not authenticated.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("nextarch_user")?.value ?? null;
}
