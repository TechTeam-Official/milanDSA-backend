import { Request, Response } from "express";
import { syncUserService } from "../../services/database/database_service";

export const syncUserController = async (req: Request, res: Response) => {
  try {
    const authPayload = req.auth as any;
    const { sub, email, name } = authPayload?.payload;

    if (!sub || !email) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid user payload" });
    }

    await syncUserService({ auth0_id: sub, email, name });

    res.json({ status: "ok", message: "User synced to database" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
