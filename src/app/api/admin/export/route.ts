import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLeadsList } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await getLeadsList();

    // Generate CSV content with UTF-8 BOM to support Turkish/non-ASCII characters in Excel
    const csvRows = [
      ["Lead ID", "First Name", "Last Name", "Email", "Scanned URL", "Created At"].join(","),
      ...leads.map(lead => [
        `"${lead.id}"`,
        `"${lead.first_name.replace(/"/g, '""')}"`,
        `"${lead.last_name.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        `"${(lead.url || '').replace(/"/g, '""')}"`,
        `"${new Date(lead.created_at).toISOString()}"`
      ].join(","))
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="marketing_leads_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
