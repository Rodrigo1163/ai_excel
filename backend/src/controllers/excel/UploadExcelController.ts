import type { Request, Response } from "express";
import { UploadExcelServices } from "../../services/excel/UploadExcelServices";

class UploadExcelController {
  async handle(req: Request, res: Response) {
    const userId = req.user_id;
    const { originalname, filename: path, mimetype } = req.file;

    const uploadExcelServices = new UploadExcelServices();
    const excel = await uploadExcelServices.execute({
      name: originalname,
      path: path,
      userId,
      mimetype,
    });
    return res.json(excel);
  }
}

export { UploadExcelController };
