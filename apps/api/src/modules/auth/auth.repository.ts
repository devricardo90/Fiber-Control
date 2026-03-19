import type { Prisma, User } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type UserRecord = Prisma.UserGetPayload<Record<string, never>>;

export type CreateUserRepositoryInput = {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "OPERATOR";
};

export class AuthRepository {
  async countUsers(): Promise<number> {
    return prisma.user.count();
  }

  async createUser(input: CreateUserRepositoryInput): Promise<UserRecord> {
    return prisma.user.create({
      data: input
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id: userId
      }
    });
  }
}
