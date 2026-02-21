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
    const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;
    console.log('Sending email to:', createdUser.email);
    // передаю токен в EmailService
    await this.emailService.sendEmail(
      createdUser.email,
      'Verify your email',
      'd-c140abc61f854bef8542ecbe5ad6a3f4',
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
      const user = await this.usersService.findOneByEmail(email);
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
      await this.emailService.sendEmail(
        user.email,
        'Reset your password',
        'd-8fe8c5b38cce4d0e9cd3338565e4edf7',
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
