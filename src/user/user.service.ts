import { Injectable } from '@nestjs/common';
import type { CreateUser, UpdateUser } from './interface/user.interface';
import { UserDataService } from './user.data-service';

@Injectable()
export class UsersService {
  constructor(private readonly userDataService: UserDataService) {}

  async create(createUser: CreateUser) {
    return await this.userDataService.create(createUser);
  }

  async findAll() {
    try {
      const users = await this.userDataService.findAll();
      if (!users || users.length === 0) {
        throw new Error('No users found');
      }
      return users;
    } catch {
      throw new Error('Error fetching users');
    }
  }

  async findOne(query: { id?: number; email?: string }) {
    return await this.userDataService.findOne(query);
  }

  async update(id: number, updateUser: UpdateUser) {
    try {
      const user = await this.userDataService.findOne({ id });
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userDataService.update(id, updateUser);
    } catch {
      throw new Error('Error updating user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userDataService.findOne({ id });
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userDataService.remove(id);
    } catch {
      throw new Error('Error removing user');
    }
  }

  async markAsVerified(id: number) {
    try {
      const user = await this.userDataService.findOne({ id });
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userDataService.markAsVerified(id);
    } catch {
      throw new Error('Error marking user as verified');
    }
  }
}
