import { supabase } from "../../config/supabase";
import { transporter } from "../../config/nodemailer";
import { signJwt } from "../../utils/jwt";

export const authService = {
  async sendOtp(email: string) {
    if (!email) throw new Error("Email required");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 🔒 Safe Upsert
    await supabase.from("otps").delete().eq("email", email);

    const { error } = await supabase
      .from("otps")
      .insert({ email, code: otp, expires_at: expiresAt });

    if (error) throw new Error(error.message);

    // 👇 Fixed the HTML String here (added backticks)
    const htmlContent = `
      <div style="background-color: #f3e8ff; padding: 20px; font-family: sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; background: #4a0404; color: white; padding: 20px; border-radius: 10px;">
          <h1 style="text-align: center;">MILAN '26</h1>
          <p style="text-align: center;">Your verification code is:</p>
          <div style="background: black; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p style="text-align: center; font-size: 12px; margin-top: 20px;">Valid for 10 minutes.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Milan '26" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Login Code: ${otp}`,
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

    // Cleanup
    await supabase.from("otps").delete().eq("email", email);

    // Return JWT
    const token = signJwt({ email, id: "user_" + Date.now() });
    return { success: true, token, user: { email, name: email.split("@")[0] } };
  },

  // Verify Pass Logic
  verifyPass(email: string, passType: string) {
    const domain = email.split("@")[1]?.toLowerCase();

    // SRM Restricted Pass Check
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
