import { Request, Response, NextFunction } from "express";
import { webhookService } from "../../services/webhook/webhook_service";

export const webhookController = {

  async handlePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await webhookService.processPost(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async handleGet(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await webhookService.processGet(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

};
