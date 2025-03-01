import prismaClient from "../../prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
interface AuthUserServicesProps {
  email: string;
  password: string;
}

class AuthUserServices {
  async execute({ email, password }: AuthUserServicesProps): Promise<{
    id: string;
    name: string;
    email: string;
    token: string;
  }> {
    if (!email || !password) {
      throw new Error("Preencha todos os campos!");
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Email ou Senha Incorretos!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou Senha Incorretos!");
    }

    const token = await sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    };
  }
}

export { AuthUserServices };
