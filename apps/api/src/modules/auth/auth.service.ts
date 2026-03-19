import { AppError } from "../../lib/app-error.js";
import { createAccessToken, hashPassword, verifyPassword } from "../../lib/auth.js";
import type { AuthRepository } from "./auth.repository.js";

type UserRecord =
  | Awaited<ReturnType<AuthRepository["createUser"]>>
  | NonNullable<Awaited<ReturnType<AuthRepository["findUserByEmail"]>>>
  | NonNullable<Awaited<ReturnType<AuthRepository["findUserById"]>>>;

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(input: { fullName: string; email: string; password: string }) {
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, "USER_ALREADY_EXISTS", "User already exists");
    }

    const userCount = await this.authRepository.countUsers();
    const user = await this.authRepository.createUser({
      fullName: input.fullName,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: userCount === 0 ? "ADMIN" : "OPERATOR"
    });

    return {
      user: mapUser(user),
      accessToken: createAccessToken({
        userId: user.id,
        email: user.email,
        role: mapUserRole(user.role)
      })
    };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user || !user.isActive || !verifyPassword(input.password, user.passwordHash)) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    return {
      user: mapUser(user),
      accessToken: createAccessToken({
        userId: user.id,
        email: user.email,
        role: mapUserRole(user.role)
      })
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user || !user.isActive) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid authentication token");
    }

    return mapUser(user);
  }
}

function mapUser(user: UserRecord) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: mapUserRole(user.role),
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

function mapUserRole(role: string) {
  const roleMap: Record<string, "admin" | "operator"> = {
    ADMIN: "admin",
    OPERATOR: "operator"
  };

  return roleMap[role] ?? "operator";
}
