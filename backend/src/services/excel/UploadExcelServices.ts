import prismaClient from "../../prisma";
interface UploadExcelServicesProps {
  name: string;
  path: string;
  userId: string;
}

class UploadExcelServices {
  async execute({ name, path, userId }: UploadExcelServicesProps) {
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
    return excel;
  }
}

export { UploadExcelServices };
