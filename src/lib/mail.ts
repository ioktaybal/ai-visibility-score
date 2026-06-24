import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLeadEmails({
  firstName,
  lastName,
  email,
  reportId,
  url,
  overallScore,
  risk,
  baseUrl
}: {
  firstName: string;
  lastName: string;
  email: string;
  reportId: string;
  url: string;
  overallScore: number;
  risk: string;
  baseUrl: string;
}) {
  const reportLink = `${baseUrl}/report/${reportId}`;
  const domainName = new URL(url).hostname;

  // Formatting risk color
  const getRiskColor = (r: string) => {
    if (r === "HIGH") return "#ef4444";
    if (r === "MEDIUM") return "#f59e0b";
    return "#10b981";
  };

  // Strip leading/trailing quotes from env SMTP_FROM_NAME to prevent double-quote spam flags
  const rawFromName = process.env.SMTP_FROM_NAME || "Ismail Oktay BAL";
  const fromName = rawFromName.replace(/^["']|["']$/g, "");

  // 1. Send Email to the Lead (Personal & Conversational HTML Layout to bypass SPAM filters)
  const leadMailOptions = {
    from: `"${fromName}" <${process.env.SMTP_FROM_EMAIL || "report@iobs.link"}>`,
    to: email,
    subject: `AI Visibility Score analysis for ${domainName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        
        <p>I just ran the AI Visibility Score analysis for your website (<strong>${domainName}</strong>) and compiled your report.</p>
        
        <p>Based on the scan, here is a quick overview of how AI search models (like ChatGPT, Gemini, Claude, and Google AI Overviews) currently perceive your brand:</p>
        
        <ul style="list-style: none; padding-left: 0; margin: 15px 0;">
          <li style="margin-bottom: 8px;"><strong>• Website:</strong> ${domainName}</li>
          <li style="margin-bottom: 8px;"><strong>• Overall AI Visibility Score:</strong> ${overallScore}/100</li>
          <li style="margin-bottom: 8px;"><strong>• AI Discoverability Risk:</strong> <span style="color: ${getRiskColor(risk)}; font-weight: bold;">${risk}</span></li>
        </ul>
        
        <p>I have prepared a full interactive report detailing your entity database gaps, conversational authority recognition, and a customized 90-day threat mitigation roadmap. You can view the unlocked report directly here:</p>
        
        <p><a href="${reportLink}" target="_blank" style="color: #000080; font-weight: bold; text-decoration: underline;">${reportLink}</a></p>
        
        <p>Let me know if you have any questions or if you'd like to jump on a quick call to discuss a Generative Engine Optimization (GEO) strategy to help your brand stand out in AI searches.</p>
        
        <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
        
        <p style="margin-top: 15px; margin-bottom: 0; font-weight: bold; color: #111827;">Ismail Oktay BAL</p>
        <p style="margin: 0; font-size: 13px; color: #4b5563;">Healthcare Growth Systems | SEO • GEO • AI Visibility Strategy</p>
        <p style="margin: 0; font-size: 13px; color: #4b5563;">
          <a href="mailto:hi@ismailoktaybal.com" style="color: #000080; text-decoration: none;">hi@ismailoktaybal.com</a> | 
          <a href="https://www.ismailoktaybal.com" style="color: #000080; text-decoration: none;">www.ismailoktaybal.com</a>
        </p>
      </div>
    `,
  };

  // 2. Send Notification Email to the Admin (English)
  const adminMailOptions = {
    from: `"${fromName}" <${process.env.SMTP_FROM_EMAIL || "report@iobs.link"}>`,
    to: process.env.ADMIN_NOTIFICATION_EMAIL || "report@iobs.link",
    subject: `🚀 Lead Captured: ${domainName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #111827; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981; font-size: 18px; font-weight: bold; margin-bottom: 10px;">New Lead Captured! 🚀</h2>
        <p>A new user unlocked their AI Visibility Score report.</p>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0; width: 120px;">Name:</td>
              <td style="color: #111827; padding: 4px 0; font-weight: bold;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Email:</td>
              <td style="color: #111827; padding: 4px 0; font-weight: bold;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Website Scanned:</td>
              <td style="color: #111827; padding: 4px 0; font-weight: bold;">${domainName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Overall Score:</td>
              <td style="color: #000080; padding: 4px 0; font-weight: bold;">${overallScore}/100</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">AI Risk Level:</td>
              <td style="color: ${getRiskColor(risk)}; padding: 4px 0; font-weight: bold;">${risk}</td>
            </tr>
          </table>
        </div>
        
        <p><a href="${reportLink}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Report Detail</a></p>
      </div>
    `,
  };

  console.log(`[Mail Utility] Initiating SMTP email dispatch for ${email} & admin notification.`);
  
  // Concurrently send both emails without blocking each other
  try {
    const results = await Promise.allSettled([
      transporter.sendMail(leadMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    results.forEach((res, index) => {
      const label = index === 0 ? "Lead Email" : "Admin Notification";
      if (res.status === "fulfilled") {
        console.log(`[Mail Utility] ${label} successfully sent. MessageId:`, res.value.messageId);
      } else {
        console.error(`[Mail Utility] ${label} sending failed:`, res.reason);
      }
    });
  } catch (err) {
    console.error("[Mail Utility] Fatal error during SMTP execution:", err);
  }
}
