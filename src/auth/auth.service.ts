import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //"Sign Up" endpoint
  async signUp(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('USER_ALREADY_EXISTS');
    }
    await this.usersService.create({ email, password });
    return {
      // 💡 Here the JWT secret key that's used for signing the payload
      // is the key that was passsed in the JwtModule
      access_token: await this.jwtService.signAsync({ user: email }),
    };
  }

  //"Sign in" endpoint
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('USER_EMAIL_NOT_FOUND');
    }

    const match = await bcrypt.compare(password, user.password); //(обычный пароль, хеш из БД)
    //bcrypt— это популярная и широко используемая криптографическая хеш-функция для безопасного хранения паролей.
    //user.password; //это хеш пароля, который хранится в базе данных. Когда пользователь пытается войти в систему, мы сравниваем введенный пароль с хешем пароля, используя bcrypt.compare. Если пароли совпадают, пользователь аутентифицирован успешно. Если нет, мы выбрасываем исключение BadRequestException с сообщением 'INVALID_PASSWORD'.

    if (!match) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    const payload = { id: user.id };
    return {
      // 💡 Here the JWT secret key that's used for signing the payload
      // is the key that was passsed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
