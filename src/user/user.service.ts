import { Injectable } from '@nestjs/common';
import type { CreateUser, UpdateUser } from './intertypes/user.intertype';
import { UserDataService } from './user.data-service';

@Injectable()
export class UsersService {
  constructor(private readonly userDataService: UserDataService) {}

  async create(createUserDto: CreateUser) {
    return await this.userDataService.create(createUserDto);
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

  async findOne(id: number) {
    try {
      const user = await this.userDataService.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch {
      throw new Error('Error fetching user');
    }
  }

  async findOneByEmail(email: string) {
    return await this.userDataService.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUser) {
    try {
      const user = await this.userDataService.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userDataService.update(id, updateUserDto);
    } catch {
      throw new Error('Error updating user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userDataService.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userDataService.remove(id);
    } catch {
      throw new Error('Error removing user');
    }
  }
}
