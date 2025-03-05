import type { Request, Response } from "express";
import { SendMessageIaExcelServices } from "../../services/ia/SendMessageIaExcelServices";

class SendMessageIaExcelController {
  async handle(req: Request, res: Response) {
    const { message } = req.body;
    const userId = req.user_id;

    const sendMessageIaExcelServices = new SendMessageIaExcelServices();
    const sendMessage = await sendMessageIaExcelServices.execute({
      userId,
      message,
    });
    return res.json(sendMessage);
  }
}

export { SendMessageIaExcelController };
