import { hash } from "bcrypt";
import prismaClient from "../../prisma";

interface CreateUserServicesProps {
  name: string;
  email: string;
  password: string;
}
class CreateUserServices {
  async execute({
    name,
    email,
    password,
  }: CreateUserServicesProps): Promise<
    { name: string; email: string } | undefined
  > {
    if (!name || !email || !password) {
      throw new Error("Preencha todos os campos!");
    }
    const ifExistUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (ifExistUser) {
      throw new Error("Email ja cadastrado!");
    }

    const passwordHash = await hash(password, 8);
    try {
      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHash,
        },
        select: {
          name: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}

export { CreateUserServices };
