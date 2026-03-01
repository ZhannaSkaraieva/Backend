import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUser, UpdateUser } from './interface/user.interface';
import { User } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(query: { id?: number; email?: string }): Promise<User | null> {
    //опверяю наличие хотя бы одного параметра для поиска, иначе возвращаю null
    if (!query.id && !query.email) {
      return null;
    }
    return await this.prismaService.user.findUnique({
      where: query.id ? { id: query.id } : { email: query.email },
    });
  }

  async create(createUser: CreateUser): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUser.password, saltRounds);
    return await this.prismaService.user.create({
      data: {
        email: createUser.email,
        password: hashedPassword,
        isVerified: false,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async update(id: number, updateUser: UpdateUser): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: { ...updateUser },
    });
  }

  async markAsVerified(id: number): Promise<User> {
    return await this.update(id, { isVerified: true });
  }

  async remove(id: number): Promise<User> {
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
