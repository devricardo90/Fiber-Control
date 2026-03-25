import { AppError } from "../../lib/app-error.js";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  createAccessToken,
  hashPassword,
  verifyPassword
} from "../../lib/auth.js";
import type { AuthRepository } from "./auth.repository.js";

type UserRecord =
  | Awaited<ReturnType<AuthRepository["createUser"]>>
  | NonNullable<Awaited<ReturnType<AuthRepository["findUserByEmail"]>>>
  | NonNullable<Awaited<ReturnType<AuthRepository["findUserById"]>>>;

type SessionPayload = {
  user: ReturnType<typeof mapUser>;
  accessToken: string;
  expiresAt: string;
};

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(
    input: { fullName: string; email: string; password: string },
    actor?: { id: string; role: "admin" | "operator" } | null
  ) {
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, "USER_ALREADY_EXISTS", "User already exists");
    }

    const userCount = await this.authRepository.countUsers();

    if (userCount > 0 && actor?.role !== "admin") {
      throw new AppError(403, "FORBIDDEN", "Admin access is required");
    }

    const user = await this.authRepository.createUser({
      fullName: input.fullName,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: userCount === 0 ? "ADMIN" : "OPERATOR"
    });

    return this.buildSession(user);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user || !user.isActive || !verifyPassword(input.password, user.passwordHash)) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    return this.buildSession(user);
  }

  async getCurrentUser(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user || !user.isActive) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid authentication token");
    }

    return mapUser(user);
  }

  async listUsers() {
    const users = await this.authRepository.findManyUsers();

    return users.map(mapUser);
  }

  async updateUser(
    userId: string,
    input: {
      fullName?: string;
      role?: "admin" | "operator";
      isActive?: boolean;
    }
  ) {
    if (Object.keys(input).length === 0) {
      throw new AppError(400, "EMPTY_UPDATE_PAYLOAD", "Update payload cannot be empty");
    }

    const existingUser = await this.authRepository.findUserById(userId);

    if (!existingUser) {
      throw new AppError(404, "USER_NOT_FOUND", "User was not found");
    }

    const nextRole = input.role ? mapRoleToEnum(input.role) : existingUser.role;
    const nextIsActive = input.isActive ?? existingUser.isActive;

    if (existingUser.role === "ADMIN" && (!nextIsActive || nextRole !== "ADMIN")) {
      const activeAdminCount = await this.authRepository.countActiveAdmins();

      if (activeAdminCount <= 1 && existingUser.isActive) {
        throw new AppError(
          400,
          "LAST_ADMIN_PROTECTION",
          "The last active admin cannot be deactivated or demoted"
        );
      }
    }

    const updateData: {
      fullName?: string;
      role?: "ADMIN" | "OPERATOR";
      isActive?: boolean;
    } = {};

    if (input.fullName !== undefined) {
      updateData.fullName = input.fullName;
    }

    if (input.role !== undefined) {
      updateData.role = mapRoleToEnum(input.role);
    }

    if (input.isActive !== undefined) {
      updateData.isActive = input.isActive;
    }

    const user = await this.authRepository.updateUser(userId, updateData);

    return mapUser(user);
  }

  private buildSession(user: UserRecord): SessionPayload {
    const mappedUser = mapUser(user);
    const mappedRole = mapUserRole(user.role);
    const accessToken = createAccessToken({
      userId: user.id,
      email: user.email,
      role: mappedRole
    });
    const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000).toISOString();

    return {
      user: mappedUser,
      accessToken,
      expiresAt
    };
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

function mapRoleToEnum(role: "admin" | "operator") {
  return role === "admin" ? "ADMIN" : "OPERATOR";
}
