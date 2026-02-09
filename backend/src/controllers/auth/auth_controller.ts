import crypto from "crypto";
import path from "path";
import { supabase } from "../../config/supabase";
import { transporter } from "../../config/nodemailer";
import { signJwt } from "../../utils/jwt";

export const authService = {
  async sendOtp(email: string) {
    if (!email) throw new Error("Email required");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 1. Atomic Upsert (Ensures hashing is saved to DB)
    const { error } = await supabase
      .from("otps")
      .upsert(
        { email, code: otpHash, expires_at: expiresAt },
        { onConflict: "email" },
      );

    if (error) throw new Error(error.message);

    const imageLocalPath = path.resolve(
      __dirname,
      "../../../assets/milan-otp-card.png",
    );

    // 2. Mobile-First Hybrid Template
    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0; padding:0; background-color: #0b0b0b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0b0b0b">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="400" border="0" cellspacing="0" cellpadding="0" background="cid:milan_card" bgcolor="#4a0404" style="width:400px; height:711px; background-size: cover; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td align="center" valign="top" height="711" background="cid:milan_card" style="height:711px;">
                    <div style="height: 325px; line-height: 325px;">&nbsp;</div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-left:14px;">
                          <span style="font-family: Arial; font-size: 44px; font-weight: bold; color: #ffffff; letter-spacing: 14px;">${otp}</span>
                        </td>
                      </tr>
                    </table>
                    <div style="height: 330px; line-height: 330px;">&nbsp;</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Milan '26" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Login Code: ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "milan-otp-card.png",
          path: imageLocalPath,
          cid: "milan_card",
        },
      ],
    });

    return { success: true };
  },

  async verifyOtp(email: string, otp: string) {
    const incomingHash = crypto.createHash("sha256").update(otp).digest("hex");
    const { data } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("code", incomingHash)
      .maybeSingle();

    if (!data) throw new Error("Invalid or Expired OTP");
    if (new Date() > new Date(data.expires_at)) {
      await supabase.from("otps").delete().eq("email", email);
      throw new Error("OTP Expired");
    }

    await supabase.from("otps").delete().eq("email", email);
    const token = signJwt({ email, id: "user_" + Date.now() });
    return { success: true, token, user: { email, name: email.split("@")[0] } };
  },

  // FIXED: Added the missing verifyPass function
  verifyPass(email: string, passType: string) {
    const domain = email.split("@")[1]?.toLowerCase();
    if (passType === "single" || passType === "pro") {
      if (!domain?.endsWith("srmist.edu.in")) {
        throw new Error(
          "This pass is exclusively for SRM Verified Students (@srmist.edu.in).",
        );
      }
    }
    return { success: true, message: "Verification Successful" };
  },
};
