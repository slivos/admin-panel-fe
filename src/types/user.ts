export const UserRole = {
  Admin: "Admin",
  User: "User",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type SortField = "email" | "displayName" | "role" | "createdAt";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
