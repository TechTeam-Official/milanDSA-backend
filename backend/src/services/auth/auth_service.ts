import { supabase } from "../../config/supabase";
import { transporter } from "../../config/nodemailer";
import { signJwt } from "../../utils/jwt";

export const authService = {
  async sendOtp(email: string) {
    if (!email) throw new Error("Email required");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 🔒 Safe Upsert: Clear old and insert new
    await supabase.from("otps").delete().eq("email", email);
    const { error } = await supabase
      .from("otps")
      .insert({ email, code: otp, expires_at: expiresAt });

    if (error) throw new Error(error.message);

    // 🖼️ Dynamic Image Logic
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://srmmilan.in";
    const imagePath = process.env.OTP_IMAGE_PATH || "/Login/milan-otp-card.png";
    const bgImageUrl = `${siteUrl}${imagePath}`;

    // Environment prefix for subject line (Staging/Prod)
    const envPrefix =
      process.env.NODE_ENV === "production"
        ? ""
        : `[${process.env.NODE_ENV?.toUpperCase()}] `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color: #0b0b0b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="400" border="0" cellspacing="0" cellpadding="0" style="width:400px; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td align="center" background="${bgImageUrl}" bgcolor="#4a0404" width="400" height="711" valign="top" style="background-size: cover; background-position: center; width:400px; height:711px;">
                    <div>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr><td height="320" style="line-height:320px; font-size:1px;">&nbsp;</td></tr>
                      </table>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: bold; color: #ffffff; letter-spacing: 12px; padding-left: 12px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
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
      subject: `${envPrefix}Your Login Code: ${otp}`,
      html: htmlContent,
    });

    return { success: true };
  },

  async verifyOtp(email: string, otp: string) {
    const { data } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("code", otp)
      .maybeSingle();

    if (!data) throw new Error("Invalid or Expired OTP");
    if (new Date() > new Date(data.expires_at)) throw new Error("OTP Expired");

    await supabase.from("otps").delete().eq("email", email);

    const token = signJwt({ email, id: "user_" + Date.now() });
    return { success: true, token, user: { email, name: email.split("@")[0] } };
  },

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
