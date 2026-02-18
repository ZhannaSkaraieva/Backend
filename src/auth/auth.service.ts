import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

interface JwtPayload {
  id: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
    const createdUser = await this.usersService.create({ email, password });
    // генерирую verification token
    const verificationToken = await this.jwtService.signAsync(
      { id: createdUser.id },
      { expiresIn: '1h' },
    );
    console.log('Sending email to:', createdUser.email);
    // передаю токен в EmailService
    await this.emailService.sendVerificationEmail(
      createdUser.email,
      verificationToken,
    );
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
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    const payload = { id: user.id };
    return {
      // 💡 Here the JWT secret key that's used for signing the payload
      // is the key that was passsed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

    await this.usersService.markAsVerified(payload.id);

    return { message: 'Email verified successfully' };
  }
}
