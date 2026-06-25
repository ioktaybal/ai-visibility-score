import { NextResponse } from 'next/server';
import { saveLead, getReportData, updateReportClientInfo } from '@/lib/db';
import { sendLeadEmails } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { reportId, firstName, lastName, email, location } = await req.json();

    if (!reportId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const leadId = await saveLead(reportId, firstName, lastName, email);

    // Persist personalized client details onto the report
    try {
      const clientName = `${firstName} ${lastName}`;
      const clientLocation = location || "";
      await updateReportClientInfo(reportId, clientName, clientLocation);
      console.log(`[API /api/lead] Updated report ${reportId} with client info: ${clientName}, ${clientLocation}`);
    } catch (updateErr) {
      console.error("[API /api/lead] Failed to update report client details:", updateErr);
    }

    // Fetch report data to send email summaries
    try {
      const report = await getReportData(reportId);
      if (report) {
        // Construct the base URL dynamically from request headers
        let origin = process.env.NEXT_PUBLIC_APP_URL || '';
        if (!origin) {
          const host = req.headers.get("host") || "localhost:3000";
          const protocol = req.headers.get("x-forwarded-proto") || "http";
          const dynamicOrigin = req.headers.get("origin") || `${protocol}://${host}`;
          const isLocalhost = dynamicOrigin.includes("localhost") || dynamicOrigin.includes("127.0.0.1");
          origin = isLocalhost ? dynamicOrigin : "https://app.ismailoktaybal.com";
        }

        console.log(`[API /api/lead] Triggering email notifications for report ${reportId} with base URL: ${origin}`);
        
        // Fire-and-forget: send emails in the background so client response is not delayed
        sendLeadEmails({
          firstName,
          lastName,
          email,
          reportId,
          url: report.url,
          overallScore: report.overall_score,
          risk: report.ai_discoverability_risk,
          baseUrl: origin
        }).catch(err => {
          console.error("[API /api/lead] sendLeadEmails background execution failed:", err);
        });
      }
    } catch (dbErr) {
      console.error("[API /api/lead] Failed to fetch report data for email dispatch:", dbErr);
    }

    return NextResponse.json({ success: true, leadId });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

