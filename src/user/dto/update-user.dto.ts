import { UpdateUser } from '../interface/user.interface';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto implements UpdateUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password Length Must Be Min 6 Charcters',
  })
  @IsString()
  password: string;

  @IsBoolean()
  isVerified?: boolean;
}
