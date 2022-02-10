import { createGet } from "../client";

export interface User {
  first_name: string;
  last_name: string;
  full_name: string;
  status: string;
  email: string;
  role?: string;
  total_capacity?: number;
  active_projects_count?: number;
}

export class UserAPI {
  static currentUser = createGet<User>("/public/user/current-user/");
  static loadUsers = createGet<User[]>("/public/user/");
}
