import prismaClient from "../../prisma";
import type { Excel } from "@prisma/client";
import XLSX from "xlsx";
import { resolve } from "node:path";
import fs from "node:fs";

interface UploadExcelServicesProps {
  name: string;
  path: string;
  userId: string;
  mimetype: string;
}

class UploadExcelServices {
  async execute({ name, path, userId, mimetype }: UploadExcelServicesProps) {
    const excel = await prismaClient.excel.upsert({
      create: {
        name,
        path,
        userId,
      },
      update: {
        path,
      },
      where: {
        userId,
      },
    });
    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      await this.convertXLSXtoCSV(excel);
    }

    return excel;
  }
  async convertXLSXtoCSV(file: Excel): Promise<string> {
    const filePath = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "tmp",
      "excel",
      file.path
    );

    const workbook = XLSX.readFile(filePath, { codepage: 65001 });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const csvData = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
    });

    const newFilePath = filePath.replace(".xlsx", ".csv");
    const newNameFile = file.path.replace(".xlsx", ".csv");

    return new Promise((resolve, reject) => {
      fs.writeFile(newFilePath, csvData, (err) => {
        if (err) {
          return reject(err);
        }
        fs.unlink(filePath, async (err) => {
          if (err) {
            return reject(err);
          }
          await prismaClient.excel.update({
            where: {
              userId: file.userId,
            },
            data: {
              path: newNameFile,
            },
          });
          resolve(newFilePath);
        });
      });
    });
  }
}

export { UploadExcelServices };
