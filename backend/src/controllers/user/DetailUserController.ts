import type { Request, Response } from "express";
import { DetailUserServices } from "../../services/user/DetailUserServices";
class DetailUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const detailUserServices = new DetailUserServices();
    const user = await detailUserServices.execute({ id });
    return res.json(user);
  }
}
export { DetailUserController };
