import prismaClient from "../../prisma";
interface UploadExcelServicesProps {
  name: string;
  path: string;
  userId: string;
}

class UploadExcelServices {
  async execute({ name, path, userId }: UploadExcelServicesProps) {
    const excel = await prismaClient.excel.create({
      data: {
        name,
        path,
        userId,
      },
    });
    return excel;
  }
}

export { UploadExcelServices };
