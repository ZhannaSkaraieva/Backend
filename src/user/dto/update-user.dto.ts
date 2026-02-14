import { UpdateUser } from '../intertypes/user.intertype';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

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
}
