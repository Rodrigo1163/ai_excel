import prismaClient from "../../prisma";

interface DetailUserServicesParams {
  id: string;
}

class DetailUserServices {
  async execute({
    id,
  }: DetailUserServicesParams): Promise<{ name: string; email: string }> {
    if (!id) {
      throw new Error("Usuário nao encontrado!");
    }
    const user = await prismaClient.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      throw new Error("Usuário não encontrado!");
    }
    return user;
  }
}

export { DetailUserServices };
