import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

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
    private configService: ConfigService,
  ) {}

  //"Sign Up" endpoint
  async signUp(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    if (user) {
      throw new BadRequestException('USER_ALREADY_EXISTS');
    }
    const createdUser = await this.usersService.create({ email, password });
    // генерирую verification token
    const payload = { id: createdUser.id, email: createdUser.email };
    const verificationToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;
    console.log('Sending email to:', createdUser.email);
    // передаю токен в EmailService
    const provider =
      this.configService.get<string>('MAIL_PROVIDER') || 'sendgrid';
    await this.emailService.send(
      provider, //можно передать провайдера напрямую в метод, если нужно
      createdUser.email,
      'Verify your email',
      'verify-email',
      { verificationLink },
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
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException('USER_EMAIL_NOT_FOUND');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    const payload = { id: user.id, email: user.email };
    return {
      // 💡 Here the JWT secret key that's used for signing the payload
      // is the key that was passsed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      await this.usersService.markAsVerified(payload.id);

      return { message: 'Email verified successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.usersService.findOne({ email });
      if (!user) {
        throw new BadRequestException('USER_EMAIL_NOT_FOUND');
      }
      const resetToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '1h' },
      );
      const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;
      console.log('Sending email to:', user.email);
      // передаю токен в EmailService
      const provider =
        this.configService.get<string>('MAIL_PROVIDER') || 'sendgrid';
      await this.emailService.send(
        provider, //можно передать провайдера напрямую в метод, если нужно
        user.email,
        'Reset your password',
        'reset password',
        { resetLink },
      );
      return { message: 'Password reset email sent' };
    } catch {
      throw new BadRequestException('Error processing password reset request');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.usersService.update(payload.id, { password: hashedPassword });
      return { message: 'Password reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
