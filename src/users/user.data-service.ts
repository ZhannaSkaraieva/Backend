import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUser, UpdateUser } from './intertypes/user.intertype';
import { User } from './entities/user.entity';

@Injectable()
export class UserDataService {
  constructor(private readonly prismaService: PrismaService) {}
  //   private users = [
  //     { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  //     { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  //   ];

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async create(createUserDto: CreateUser): Promise<User> {
    return await this.prismaService.user.create({
      data: { ...createUserDto },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async update(id: number, updateUserDto: UpdateUser): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  async remove(id: number): Promise<User | null> {
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
