import { Request, Response, NextFunction } from "express";
import { passService } from "../../services/pass/pass_service";

export const passController = {

  async handlePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await passService.processPost(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async handleGet(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await passService.processGet(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

};
