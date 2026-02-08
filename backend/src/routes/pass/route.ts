import { Router } from "express";
import { passMiddleware } from "../../middleware/pass/pass_middleware";
import { passController } from "../../controllers/pass/pass_controller";

const router = Router();

/**
 * Route ? Middleware ? Controller ? Service
 */
router.use(passMiddleware);

router.post("/", passController.handlePost);
router.get("/", passController.handleGet);

export default router;
