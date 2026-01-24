// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  name: string;
  email: string;
  phone: string;
  college: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  entryFee: number;
  paymentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ConfirmationEmailRequest = await req.json();
    const { name, email, eventName, eventDate, eventTime, eventVenue, entryFee, paymentId } = data;

    const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation - VIBRANCE 2026</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a1a;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #FF2FB3 0%, #7B2FFF 100%); padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">
        VIBRANCE 2026
      </h1>
      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
        Where Music, Madness & Memories Collide
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 40px;">✓</span>
        </div>
        <h2 style="margin: 0; color: #ffffff; font-size: 24px;">Registration Successful!</h2>
      </div>

      <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6;">
        Hey <strong style="color: #FF2FB3;">${name}</strong>! 🎉
      </p>
      <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6;">
        Your registration for <strong style="color: #00E5FF;">${eventName}</strong> has been confirmed. 
        Get ready for an unforgettable experience!
      </p>

      <!-- Event Details Card -->
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 25px; margin: 30px 0;">
        <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
          📋 Event Details
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Event</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">${eventName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Date</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Time</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Venue</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${eventVenue}</td>
          </tr>
        </table>
      </div>

      <!-- Payment Receipt -->
      <div style="background: linear-gradient(135deg, rgba(255,47,179,0.1) 0%, rgba(123,47,255,0.1) 100%); border: 1px solid rgba(255,47,179,0.3); border-radius: 16px; padding: 25px; margin: 30px 0;">
        <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
          🧾 Payment Receipt
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Payment ID</td>
            <td style="padding: 10px 0; color: #00E5FF; font-size: 14px; text-align: right; font-family: monospace;">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Amount Paid</td>
            <td style="padding: 10px 0; color: #10B981; font-size: 20px; text-align: right; font-weight: 700;">₹${entryFee}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a0a0b0; font-size: 14px;">Status</td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="background: #10B981; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">PAID</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 40px 0;">
        <p style="color: #a0a0b0; font-size: 14px; margin-bottom: 20px;">
          Save this email as your entry pass. Show it at the venue!
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: rgba(0,0,0,0.3); padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="margin: 0 0 10px 0; color: #FF2FB3; font-size: 18px; font-weight: 700;">
        See you at the fest! 🎉
      </p>
      <p style="margin: 0; color: #a0a0b0; font-size: 12px;">
        March 15-17, 2026 • Central University Campus
      </p>
      <div style="margin-top: 20px;">
        <a href="#" style="color: #00E5FF; text-decoration: none; margin: 0 10px; font-size: 12px;">Instagram</a>
        <a href="#" style="color: #00E5FF; text-decoration: none; margin: 0 10px; font-size: 12px;">YouTube</a>
        <a href="#" style="color: #00E5FF; text-decoration: none; margin: 0 10px; font-size: 12px;">Website</a>
      </div>
      <p style="margin: 20px 0 0 0; color: #666; font-size: 11px;">
        © 2026 VIBRANCE. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "VIBRANCE 2026 <onboarding@resend.dev>",
      to: [email],
      subject: `🎉 Registration Confirmed - ${eventName} | VIBRANCE 2026`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send confirmation email";
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
