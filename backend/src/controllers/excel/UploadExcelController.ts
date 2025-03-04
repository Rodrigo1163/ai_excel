import type { Request, Response } from "express";
import { UploadExcelServices } from "../../services/excel/UploadExcelServices";

class UploadExcelController {
  async handle(req: Request, res: Response) {
    const { userId } = req.body;
    const { originalname, filename: path } = req.file;

    if (!originalname || !path) {
      throw new Error("Falha ao fazer upload");
    }

    const uploadExcelServices = new UploadExcelServices();
    const excel = await uploadExcelServices.execute({
      name: originalname,
      path: path,
      userId,
    });
    return res.json(excel);
  }
}

export { UploadExcelController };
