import type { CreateUser } from '../interface/user.interface';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto implements CreateUser {
  @IsNotEmpty({ message: 'Please Enter your Email' })
  @IsEmail({}, { message: 'Please Enter a Valid Email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password Length Must Be Min 6 Charcters',
  })
  @IsString()
  password: string;
}
