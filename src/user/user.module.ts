import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { UserDataService } from './user.data-service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserDataService, PrismaService],
  exports: [UsersService], //добавить UsersService в массив exports декоратора @Module, чтобы он был виден за пределами этого модуля (AuthService).
})
export class UsersModule {}
