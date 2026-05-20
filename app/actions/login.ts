"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export async function loginaction(_prev: unknown, formdata: FormData) {
  const email = (formdata.get("login_email") as string)?.trim().toLowerCase();
  const password = formdata.get("login_pass") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) {
    return { error: "Invalid operator ID or access key." };
  }

  const isValid = password === (user.password as string);
  if (!isValid) {
    return { error: "Invalid operator ID or access key." };
  }

  // ── Set auth cookie ──────────────────────────────────────────
  const cookieStore = await cookies();
  cookieStore.set("nextarch_user", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });

  redirect("/calculator");
}

export async function to_desc() {
  redirect("/description");
}

export async function to_calc() {
  redirect("/calculator");
}