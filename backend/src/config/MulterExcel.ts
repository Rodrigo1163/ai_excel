import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";

import { extname, resolve } from "node:path";
import prismaClient from "../prisma";

const deleteFileBD = async (userId: string) => {
  const deleteFile = await prismaClient.excel.deleteMany({
    where: {
      userId,
    },
  });
};

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", folder),
        filename: async (request, file, callback) => {
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

          const ifFileUserExist = await prismaClient.excel.findFirst({
            where: {
              userId,
            },
            select: {
              path: true,
            },
          });

          if (ifFileUserExist) {
            const filePath = resolve(
              __dirname,
              "..",
              "..",
              folder,
              ifFileUserExist.path
            );
            fs.stat(filePath, async (err) => {
              if (err) {
                await deleteFileBD(userId);
                return callback(new Error("Error ao atualizar o arquivo!"), "");
              }
              fs.unlink(filePath, (err) => {
                if (err) {
                  return callback(
                    new Error("Error ao atualizar o arquivo!"),
                    ""
                  );
                }
                return callback(null, filename);
              });
            });
          } else {
            return callback(null, filename);
          }
        },
      }),
    };
  },
};
