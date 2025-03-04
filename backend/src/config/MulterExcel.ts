import multer from "multer";
import crypto from "node:crypto";

import { extname, resolve } from "node:path";

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", folder),
        filename: (request, file, callback) => {
          const { userId } = request.body;
          const fileHash = crypto.randomBytes(16).toString("hex");
          const filename = `${fileHash}-${file.originalname}`;
          const typesFormat = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "application/xls",
          ];
          const fileTypeValid = typesFormat.includes(file.mimetype);

          if (!userId) return callback(new Error("Faça seu login"), "");

          if (!fileTypeValid)
            return callback(new Error("Formato inválido"), "");

          return callback(null, filename);
        },
      }),
    };
  },
};
