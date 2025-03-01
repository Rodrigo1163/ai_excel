import type { Request, Response } from "express";
import { AuthUserServices } from "../../services/user/AuthUserServices";

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;
    const authUserServices = new AuthUserServices();
    const user = await authUserServices.execute({ email, password });
    return res.json(user);
  }
}

export { AuthUserController };
