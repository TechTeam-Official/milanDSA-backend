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

    // 1. Upsert to DB (Fixed the "Stuck OTP" bug)
    const { error } = await supabase
      .from("otps")
      .upsert(
        { email, code: otpHash, expires_at: expiresAt },
        { onConflict: "email" },
      );

    if (error) throw new Error(error.message);

    // 2. Resolve the local image path
    // Adjust the path based on your folder structure relative to this file
    const imageLocalPath = path.resolve(
      __dirname,
      "../../../assets/milan-otp-card.png",
    );

    const envPrefix =
      process.env.NODE_ENV === "production"
        ? ""
        : `[${process.env.NODE_ENV?.toUpperCase()}] `;

    // 3. Bulletproof Template using CID
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color: #0b0b0b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0b0b;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="400" border="0" cellspacing="0" cellpadding="0" style="width:400px; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td align="center" background="cid:milan_card" bgcolor="#4a0404" width="400" height="711" valign="top" style="background-size: cover; background-position: center; width:400px; height:711px;">
                    
                    <div>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr><td height="320" style="line-height:320px; font-size:1px;">&nbsp;</td></tr>
                      </table>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <span style="font-family: Arial, sans-serif; font-size: 42px; font-weight: bold; color: #ffffff; letter-spacing: 12px; padding-left: 12px;">
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

    // 4. Send email with the file attached as a CID
    await transporter.sendMail({
      from: `"Milan '26" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${envPrefix}Your Login Code: ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "milan-otp-card.png",
          path: imageLocalPath,
          cid: "milan_card", // This MUST match cid:milan_card in the HTML
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
