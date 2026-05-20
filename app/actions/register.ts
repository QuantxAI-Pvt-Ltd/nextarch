"use server"
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export async function registeraction(_prev: unknown, formdata: FormData) {
  const name = (formdata.get("reg_name") as string)?.trim();
  const email = (formdata.get("reg_email") as string)?.trim().toLowerCase();
  const password = formdata.get("reg_pass") as string;
  const confirm = formdata.get("reg_confirm") as string;

  // ── Validation ──────────────────────────────────────────────
  if (!name || !email || !password || !confirm) {
    return { error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email address." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  // ── DB: check for existing user ──────────────────────────────
  const client = await clientPromise;
  const db = client.db("nextarch");
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // ── Hash + insert ────────────────────────────────────────────
  await users.insertOne({
    name,
    email,
    password,
    createdAt: new Date(),
  });

  redirect("/login?registered=1");
}
