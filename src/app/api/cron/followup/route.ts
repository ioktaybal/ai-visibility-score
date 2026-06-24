import { NextResponse } from 'next/server';
import { getPendingFollowups, markFollowupSent } from '@/lib/db';
import { sendFollowupEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    // 1. Secure the cron endpoint using Vercel's Cron Secret (optional but recommended in production)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('[Cron /api/cron/followup] Unauthorized execution attempt.');
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('[Cron /api/cron/followup] Checking for pending lead followups...');
    const pendingLeads = await getPendingFollowups();
    console.log(`[Cron /api/cron/followup] Found ${pendingLeads.length} leads eligible for follow-up.`);

    if (pendingLeads.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending followups found.' });
    }

    // Dynamic base URL construction for reports
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const results = [];

    for (const lead of pendingLeads) {
      try {
        const reportUrl = lead.reports?.url || '';
        if (!reportUrl) {
          console.warn(`[Cron /api/cron/followup] Lead ${lead.id} is missing a report URL. Skipping.`);
          continue;
        }

        console.log(`[Cron /api/cron/followup] Sending program follow-up email to ${lead.email}...`);
        await sendFollowupEmail({
          firstName: lead.first_name,
          lastName: lead.last_name,
          email: lead.email,
          url: reportUrl,
          reportId: lead.report_id,
          baseUrl
        });

        // Mark as sent in the database
        await markFollowupSent(lead.id);
        
        results.push({ leadId: lead.id, email: lead.email, status: 'success' });
      } catch (sendErr: any) {
        console.error(`[Cron /api/cron/followup] Failed to dispatch email to lead ${lead.id}:`, sendErr);
        results.push({ leadId: lead.id, email: lead.email, status: 'failed', error: sendErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results
    });
  } catch (error: any) {
    console.error('[Cron /api/cron/followup] Fatal error executing follow-up cron:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
