import { createGet } from "../client";

/**
 * Represents a Bidhive user
 */
export interface User {
  /** The first name of the user */
  first_name: string;
  /** The last name of the user */
  last_name: string;
  /** The full name of the user */
  full_name: string;
  /** The email of the user */
  email: string;
  /** The role of the user */
  role?: string;
  /** The user's total work capacity. Represents a 0-100 percentage which represents how busy a user is. */
  total_capacity?: number;
  /** How many active projects a user has been assigned to */
  active_projects_count?: number;
}

/** Contains user-related API calls */
export const UserAPI = {
  /** Loads the current user current logged in
   *
   * @returns An instance of {@link User} for the requesting user
   */
  currentUser: createGet<User>("/public/user/current-user/"),
  /** Loads all active users within the requesting user's company
   *
   * @returns An array of active {@link User}s in the requesting user's company
   */
  loadUsers: createGet<User[]>("/public/user/"),
};
