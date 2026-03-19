export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "operator";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};
