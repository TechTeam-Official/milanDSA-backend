import crypto from "crypto";
import path from "path";
import { supabase } from "../../config/supabase";
import { transporter } from "../../config/nodemailer";
import { signJwt } from "../../utils/jwt";

export const authService = {
  async sendOtp(email: string) {
    if (!email) throw new Error("Email required");

    // 1. Generate 6-digit OTP and SHA-256 Hash
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 2. Atomic Upsert: Fixes "Stuck OTP" bug and permission issues
    // Ensure RLS is DISABLED for the 'otps' table in Supabase
    const { error } = await supabase
      .from("otps")
      .upsert(
        { email, code: otpHash, expires_at: expiresAt },
        { onConflict: "email" },
      );

    if (error) throw new Error(`Database Error: ${error.message}`);

    // 3. Resolve Image Path for CID Attachment
    const imageLocalPath = path.resolve(
      __dirname,
      "../../../assets/milan-otp-card.png",
    );

    const envPrefix =
      process.env.NODE_ENV === "production"
        ? ""
        : `[${process.env.NODE_ENV?.toUpperCase()}] `;

    // 4. Hybrid Template: Legacy attributes (Mobile) + VML (Outlook) + Spacers (CSS stripping)
    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
      <body style="margin:0; padding:0; background-color: #0b0b0b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0b0b0b">
          <tr>
            <td align="center" style="padding: 20px 0;">
              
              <table width="400" border="0" cellspacing="0" cellpadding="0" 
                     background="cid:milan_card" bgcolor="#4a0404" 
                     style="width:400px; max-width:400px; height:711px; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td align="center" valign="top" height="711" background="cid:milan_card" style="height:711px; background-image: url('cid:milan_card'); background-repeat: no-repeat; background-size: 400px 711px;">
                    
                    <div style="width:400px; margin: 0 auto;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr><td height="325" style="line-height:325px; font-size:1px;">&nbsp;</td></tr>
                      </table>
                      
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding-left:14px;">
                            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 44px; font-weight: bold; color: #ffffff; letter-spacing: 14px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr><td height="330" style="line-height:330px; font-size:1px;">&nbsp;</td></tr>
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

    // 5. Send with CID Attachment
    await transporter.sendMail({
      from: `"Milan '26" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${envPrefix}Your Login Code: ${otp}`,
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
    // Hash incoming OTP to compare with hashed value in DB
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

    // Success: Delete OTP row and generate token
    await supabase.from("otps").delete().eq("email", email);
    const token = signJwt({ email, id: "user_" + Date.now() });

    return { success: true, token, user: { email, name: email.split("@")[0] } };
  },
};
