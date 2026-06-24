"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2026";

export async function loginAdminAction(password: string) {
  console.log("[Server Action] loginAdminAction starting verification...");
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      path: "/",
    });
    console.log("[Server Action] loginAdminAction success: Cookie set.");
    return { success: true };
  }
  console.log("[Server Action] loginAdminAction failed: Incorrect password.");
  return { success: false, error: "Incorrect password" };
}

export async function logoutAdminAction() {
  console.log("[Server Action] logoutAdminAction logging out...");
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  console.log("[Server Action] logoutAdminAction success: Cookie deleted.");
  return { success: true };
}

export async function checkAdminAuth() {
  console.log("[Server Action] checkAdminAuth checking cookie...");
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthenticated = session?.value === "authenticated";
  console.log("[Server Action] checkAdminAuth result:", isAuthenticated);
  return isAuthenticated;
}

export async function getReportsListAction() {
  console.log("[Server Action] getReportsListAction fetching reports...");
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    console.log("[Server Action] getReportsListAction failed: Unauthorized access.");
    throw new Error("Unauthorized");
  }
  const { getReportsList } = await import("@/lib/db");
  const res = await getReportsList();
  console.log("[Server Action] getReportsListAction fetched:", res.length, "reports.");
  return res;
}

export async function getLeadsListAction() {
  console.log("[Server Action] getLeadsListAction fetching leads...");
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    console.log("[Server Action] getLeadsListAction failed: Unauthorized access.");
    throw new Error("Unauthorized");
  }
  const { getLeadsList } = await import("@/lib/db");
  const res = await getLeadsList();
  console.log("[Server Action] getLeadsListAction fetched:", res.length, "leads.");
  return res;
}


