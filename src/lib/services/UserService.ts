import { BaseService } from "./BaseService";
import { User, UserCreate, UserUpdate } from "@/types/user";

export class UserService extends BaseService<User> {
  constructor() {
    super("users");
  }

  async createUser(data: UserCreate): Promise<User> {
    return this.create(data);
  }

  async updateUser(id: string, data: UserUpdate): Promise<User> {
    return this.update(id, data);
  }

  async getUserWithRole(id: string): Promise<User> {
    return this.getById(id, "*, role:roles(*)");
  }

  async getUsersByRole(roleKey: string): Promise<User[]> {
    return this.getAll(`* where role.role_key=eq.${roleKey}`);
  }
}

// Export singleton instance
export const userService = new UserService();
