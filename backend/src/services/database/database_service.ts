import { supabase } from "../../config/database";

interface UserPayload {
  auth0_id: string;
  email: string;
  name?: string;
}

export const syncUserService = async (user: UserPayload) => {
  const { error } = await supabase
    .from("users")
    .upsert([user], { onConflict: "auth0_id" }); // Removed the brackets []

  if (error) {
    console.error("Sync User Error:", error.message);
    throw error;
  }
};
